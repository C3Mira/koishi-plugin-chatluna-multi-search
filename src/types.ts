export type ProviderName = 'tavily' | 'exa'

export interface SearchParams {
  query: string
  count: number
  topic: 'general' | 'news'
  /** 只看最近 N 天 */
  recencyDays?: number
  includeDomains?: string[]
  excludeDomains?: string[]
  needContent: boolean
}

export interface NormalizedResult {
  title: string | null
  url: string
  date: string | null
  snippet?: string
  content?: string
}

export interface FetchedPage {
  title: string | null
  content: string
}

export interface KeyEntry {
  provider: ProviderName
  apiKey: string
  enabled: boolean
  note: string
}
