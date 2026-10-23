import type { Context } from 'koishi'
import type { Config } from '../config'
import type { FetchedPage, NormalizedResult, SearchParams } from '../types'
import { SoftError } from '../errors'
import { sinceDate, truncateText } from '../utils'

const base = (c: Config) => c.exaBaseUrl.replace(/\/+$/, '')
const headers = (key: string) => ({
  'Content-Type': 'application/json',
  'x-api-key': key
})

export async function exaSearch(
  ctx: Context, config: Config, key: string, p: SearchParams
): Promise<NormalizedResult[]> {
  const body: Record<string, unknown> = {
    query: p.query,
    type: config.exaSearchType,
    numResults: p.count,
    contents: p.needContent
      ? { text: { maxCharacters: config.searchContentLength } }
      : { highlights: { maxCharacters: config.snippetLength } }
  }
  if (p.topic === 'news') body.category = 'news'
  if (p.includeDomains?.length) body.includeDomains = p.includeDomains
  if (p.excludeDomains?.length) body.excludeDomains = p.excludeDomains
  if (p.recencyDays) body.startPublishedDate = sinceDate(p.recencyDays).toISOString()

  const data: any = await ctx.http.post(`${base(config)}/search`, body, {
    headers: headers(key),
    timeout: config.requestTimeout
  })
  const results: any[] = Array.isArray(data?.results) ? data.results : []
  return results.map((r) => {
    const item: NormalizedResult = {
      title: r.title ?? null,
      url: r.url,
      date: r.publishedDate?.slice(0, 10) ?? null
    }
    if (r.highlights?.length) {
      item.snippet = truncateText(r.highlights.join('\n'), config.snippetLength)
    }
    if (p.needContent && r.text) {
      item.content = truncateText(String(r.text), config.searchContentLength)
    }
    return item
  })
}

export async function exaFetch(
  ctx: Context, config: Config, key: string, url: string
): Promise<FetchedPage> {
  const data: any = await ctx.http.post(
    `${base(config)}/contents`,
    { urls: [url], text: { maxCharacters: config.fetchContentLength } },
    { headers: headers(key), timeout: config.requestTimeout }
  )
  const page = data?.results?.[0]
  if (!page?.text) throw new SoftError('Exa 未能读取该页面')
  return { title: page.title ?? null, content: String(page.text) }
}
