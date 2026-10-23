import type { Context } from 'koishi'
import type { Config } from '../config'
import type { FetchedPage, NormalizedResult, SearchParams } from '../types'
import { SoftError } from '../errors'
import { sinceDate, truncateText } from '../utils'

const base = (c: Config) => c.tavilyBaseUrl.replace(/\/+$/, '')
const headers = (key: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${key}`
})

export async function tavilySearch(
  ctx: Context, config: Config, key: string, p: SearchParams
): Promise<NormalizedResult[]> {
  const body: Record<string, unknown> = {
    query: p.query,
    search_depth: config.tavilySearchDepth,
    max_results: p.count,
    topic: p.topic
  }
  if (p.includeDomains?.length) body.include_domains = p.includeDomains
  if (p.excludeDomains?.length) body.exclude_domains = p.excludeDomains
  if (p.recencyDays) body.start_date = sinceDate(p.recencyDays).toISOString().slice(0, 10)
  if (p.needContent) body.include_raw_content = true

  const data: any = await ctx.http.post(`${base(config)}/search`, body, {
    headers: headers(key),
    timeout: config.requestTimeout
  })
  const results: any[] = Array.isArray(data?.results) ? data.results : []
  return results.map((r) => {
    const item: NormalizedResult = {
      title: r.title ?? null,
      url: r.url,
      date: (r.published_date ?? r.publishedDate ?? null)?.toString().slice(0, 10) ?? null,
      snippet: r.content ? truncateText(String(r.content), config.snippetLength) : undefined
    }
    if (p.needContent && r.raw_content) {
      item.content = truncateText(String(r.raw_content), config.searchContentLength)
    }
    return item
  })
}

export async function tavilyFetch(
  ctx: Context, config: Config, key: string, url: string
): Promise<FetchedPage> {
  const data: any = await ctx.http.post(
    `${base(config)}/extract`,
    { urls: [url] },
    { headers: headers(key), timeout: config.requestTimeout }
  )
  const page = data?.results?.[0]
  if (!page?.raw_content) {
    const why = data?.failed_results?.[0]?.error
    throw new SoftError(`Tavily 未能读取该页面${why ? `：${why}` : ''}`)
  }
  return { title: null, content: String(page.raw_content) }
}
