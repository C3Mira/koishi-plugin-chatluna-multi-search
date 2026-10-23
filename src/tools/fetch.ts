import type { Context } from 'koishi'
import type { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager'
import type { ChatLunaToolRunnable } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { StructuredTool, z } from '../vendor'
import type { Config } from '../config'
import type { KeyPool } from '../pool'
import type { TtlCache } from '../cache'
import { isPublicHttpUrl, truncateText } from '../utils'

const Schema = z.object({
  url: z.string().describe('The public http or https URL of the web page to read.')
})

interface Input {
  url: string
}

export const FETCH_TOOL_NAME = 'smart_web_fetch'
export const FETCH_TOOL_DESCRIPTION =
  'Read a single web page and return its main text. Use it after smart_web_search when the snippets are not enough.'

export class SmartWebFetchTool extends StructuredTool {
  name = FETCH_TOOL_NAME
  description = FETCH_TOOL_DESCRIPTION
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
    const url = input.url?.trim()
    if (!url || !isPublicHttpUrl(url)) {
      return 'Error: only public http and https URLs are supported'
    }

    const cacheKey = `f:${url}`
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    try {
      const { value } = await this.pool.fetch(url)
      const out = `# ${value.title || new URL(url).hostname}\n\n${truncateText(
        value.content,
        this.config.fetchContentLength
      )}`
      this.cache.set(cacheKey, out)
      return out
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}
