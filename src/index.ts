import type { Context } from 'koishi'
import { Config } from './config'
import { KeyPool } from './pool'
import { TtlCache } from './cache'
import { SmartWebSearchTool, SEARCH_TOOL_DESCRIPTION, SEARCH_TOOL_NAME } from './tools/search'
import { SmartWebFetchTool, FETCH_TOOL_DESCRIPTION, FETCH_TOOL_NAME } from './tools/fetch'

export const name = 'chatluna-multi-search'

export const usage = `为 chatluna 提供联网搜索（Tavily + Exa），支持多个 Key 自动切换。

前置要求：已安装并启用 koishi-plugin-chatluna。

**用法**：在「密钥」里按顺序添加 Key（Tavily 和 Exa 可混用）。前一个出错、额度用完或被限流，会自动换下一个，无需人工处理。不想用某个就把它「启用」关掉。

**管理命令**（需要 3 级权限）：
- websearch.status：查看每个 Key 的状态
- websearch.test 关键词：直接测试一次搜索
- websearch.reset：清除所有暂停状态

注册的工具：smart_web_search（搜索）、smart_web_fetch（读网页）。`

export const inject = { required: ['chatluna'] }

export { Config }

const meta = (tags: string[]) => ({
  source: 'extension' as const,
  group: 'search',
  tags,
  defaultAvailability: {
    enabled: true,
    main: true,
    chatluna: true,
    characterScope: 'all' as const
  }
})

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('chatluna-multi-search')
  const pool = new KeyPool(ctx, config)
  const cache = new TtlCache(config.cacheMinutes * 60_000)

  if (pool.enabledCount === 0) {
    logger.warn('没有启用的 Key：请在插件配置「密钥」里添加 Tavily / Exa 的 API Key')
  }

  if (config.searchEnabled) {
    ctx.effect(() =>
      ctx.chatluna.platform.registerTool(SEARCH_TOOL_NAME, {
        description: SEARCH_TOOL_DESCRIPTION,
        createTool: () => new SmartWebSearchTool(ctx, config, pool, cache),
        selector: () => true,
        meta: meta(['web-search', 'tavily', 'exa'])
      })
    )
  }

  if (config.fetchEnabled) {
    ctx.effect(() =>
      ctx.chatluna.platform.registerTool(FETCH_TOOL_NAME, {
        description: FETCH_TOOL_DESCRIPTION,
        createTool: () => new SmartWebFetchTool(ctx, config, pool, cache),
        selector: () => true,
        meta: meta(['web-fetch', 'tavily', 'exa'])
      })
    )
  }

  ctx.command('websearch.status', '查看搜索 Key 的状态', { authority: 3 }).action(() => pool.status())

  ctx
    .command('websearch.reset', '清除所有 Key 的暂停状态', { authority: 3 })
    .action(() => {
      pool.resetCooldowns()
      return '已清除。'
    })

  ctx
    .command('websearch.test <query:text>', '直接测试一次搜索（会消耗额度）', { authority: 3 })
    .action(async (_, query) => {
      if (!query?.trim()) return '用法：websearch.test 关键词'
      try {
        const { value, source } = await pool.search({
          query: query.trim(),
          count: 3,
          topic: 'general',
          needContent: false
        })
        if (!value.length) return `（${source}）没有结果。`
        return (
          `来源：${source}\n` +
          value
            .map((r, i) => `${i + 1}. ${r.title ?? '(无标题)'}\n${r.url}${r.date ? `\n${r.date}` : ''}`)
            .join('\n\n')
        )
      } catch (e) {
        return e instanceof Error ? e.message : String(e)
      }
    })
}
