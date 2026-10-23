import { Schema } from 'koishi'
import type { KeyEntry } from './types'

export interface Config {
  keys: KeyEntry[]
  strategy: 'priority' | 'roundRobin'
  requestTimeout: number
  quotaCooldownMinutes: number
  cacheMinutes: number
  searchEnabled: boolean
  searchMaxCount: number
  snippetLength: number
  allowSearchContent: boolean
  searchContentLength: number
  fetchEnabled: boolean
  fetchContentLength: number
  tavilyBaseUrl: string
  tavilySearchDepth: 'basic' | 'advanced'
  exaBaseUrl: string
  exaSearchType: 'auto' | 'fast'
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    keys: Schema.array(
      Schema.object({
        provider: Schema.union([
          Schema.const('tavily').description('Tavily'),
          Schema.const('exa').description('Exa')
        ])
          .default('tavily')
          .description('搜索服务'),
        apiKey: Schema.string().role('secret').required().description('API Key'),
        enabled: Schema.boolean().default(true).description('启用（想停用某个就关掉）'),
        note: Schema.string().default('').description('备注（可选，如「小号1」）')
      })
    )
      .default([])
      .description(
        '密钥列表：按从上到下的顺序使用，前一个失败或额度用完会自动换下一个。可混填 Tavily 和 Exa，也可同一服务填多个 Key。'
      )
  }).description('密钥'),
  Schema.object({
    strategy: Schema.union([
      Schema.const('priority').description('优先级：始终先用最上面的可用 Key'),
      Schema.const('roundRobin').description('轮询：在可用 Key 之间轮流，分摊额度')
    ])
      .default('priority')
      .description('使用策略'),
    requestTimeout: Schema.number().role('ms').default(15000).description('单次请求超时（超时会换下一个 Key）'),
    quotaCooldownMinutes: Schema.number()
      .min(1)
      .default(720)
      .description('额度用完的 Key 暂停使用多久（分钟）。月度额度建议保持较长'),
    cacheMinutes: Schema.number()
      .min(0)
      .default(10)
      .description('相同搜索的缓存时间（分钟），省额度；0 为关闭')
  }).description('策略'),
  Schema.object({
    searchEnabled: Schema.boolean().default(true).description('启用搜索工具'),
    searchMaxCount: Schema.number().min(1).max(20).default(5).description('单次搜索结果上限'),
    snippetLength: Schema.number().default(800).description('单条摘要字符上限'),
    allowSearchContent: Schema.boolean().default(false).description('允许返回网页正文'),
    searchContentLength: Schema.number().default(2000).description('单条正文截断长度')
  }).description('搜索工具'),
  Schema.object({
    fetchEnabled: Schema.boolean().default(true).description('启用网页读取工具'),
    fetchContentLength: Schema.number().default(15000).description('网页正文截断长度')
  }).description('网页读取工具'),
  Schema.object({
    tavilyBaseUrl: Schema.string().default('https://api.tavily.com').description('Tavily 接口地址'),
    tavilySearchDepth: Schema.union([
      Schema.const('basic').description('basic：快、省额度'),
      Schema.const('advanced').description('advanced：更准，更耗额度')
    ])
      .default('basic')
      .description('Tavily 搜索深度'),
    exaBaseUrl: Schema.string().default('https://api.exa.ai').description('Exa 接口地址'),
    exaSearchType: Schema.union([
      Schema.const('auto').description('auto：综合质量与速度'),
      Schema.const('fast').description('fast：更快')
    ])
      .default('auto')
      .description('Exa 搜索类型')
  }).description('高级')
]) as Schema<Config>
