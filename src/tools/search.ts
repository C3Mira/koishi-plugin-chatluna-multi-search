import type { Context } from 'koishi'
import type { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import type { ChatLunaToolRunnable } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { StructuredTool, z } from '../vendor'
import type { Config } from '../config'
import type { KeyPool } from '../pool'
import type { TtlCache } from '../cache'
import type { SearchParams } from '../types'

const Schema = z.object({
  query: z
    .string()
    .describe('Search query. A clear, descriptive phrase works best (not just keywords).'),
  count: z.number().int().min(1).max(20).optional().describe('Number of results to return.'),
  topic: z
    .enum(['general', 'news'])
    .optional()
    .describe('Use "news" for recent events and breaking news; default "general".'),
  recencyDays: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional()
    .describe('Only return pages published within the last N days. Useful for time-sensitive questions.'),
  includeDomains: z.array(z.string()).optional().describe('Only return results from these domains.'),
  excludeDomains: z.array(z.string()).optional().describe('Exclude results from these domains.'),
  needContent: z
    .boolean()
    .optional()
    .describe('Set true to include page text in each result, only works when allowed by config.')
})

interface Input {
  query: string
  count?: number
  topic?: 'general' | 'news'
  recencyDays?: number
  includeDomains?: string[]
  excludeDomains?: string[]
  needContent?: boolean
}

export const SEARCH_TOOL_NAME = 'smart_web_search'
export const SEARCH_TOOL_DESCRIPTION =
  'Search the web for real-time or factual information (news, prices, versions, current events, anything that may have changed or you are unsure about). Returns results with title, url, snippet and publish date. Use it BEFORE answering when facts must be current or verifiable; do not guess.'

export class SmartWebSearchTool extends StructuredTool {
  name = SEARCH_TOOL_NAME
  description = SEARCH_TOOL_DESCRIPTION
  schema = Schema

  constructor(
    private ctx: Context,
    private config: Config,
    private pool: KeyPool,
    private cache: TtlCache
  ) {
    super()
  }

  protected async _call(
    input: Input,
    _runManager?: CallbackManagerForToolRun,
    _config?: ChatLunaToolRunnable
  ): Promise<string> {
    const query = input.query?.trim()
    if (!query) return 'Error: empty query.'

    const maxCount = Math.min(this.config.searchMaxCount, 20)
    const params: SearchParams = {
      query,
      count: Math.min(Math.max(input.count ?? maxCount, 1), maxCount),
      topic: input.topic ?? 'general',
      recencyDays: input.recencyDays,
      includeDomains: input.includeDomains,
      excludeDomains: input.excludeDomains,
      needContent: input.needContent === true && this.config.allowSearchContent
    }

    const cacheKey = `s:${JSON.stringify(params)}`
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    try {
      const { value, source } = await this.pool.search(params)
      if (value.length === 0) return 'No results found for the given query.'
      const out = JSON.stringify({
        current_time: new Date().toISOString(),
        query,
        source,
        results: value
      })
      this.cache.set(cacheKey, out)
      return out
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      return `Error: ${msg}. Tell the user you cannot search right now; do not make up results.`
    }
  }
}
