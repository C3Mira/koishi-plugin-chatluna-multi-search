/** 错误分类：决定这把 Key 要不要暂停、暂停多久 */
export type FailureKind =
  | 'quota' // 额度用完 → 长冷却
  | 'invalid' // Key 无效 → 很长冷却
  | 'rate' // 限流 → 短冷却
  | 'transient' // 网络/服务端错误 → 极短冷却
  | 'bad_request' // 请求本身有问题 / 内容抓取失败 → 不惩罚 Key，换下一个试试

/** 提供方明确表示“这个页面读不到”，不是 Key 的问题 */
export class SoftError extends Error {}

export interface Failure {
  kind: FailureKind
  message: string
}

export function classify(error: unknown): Failure {
  if (error instanceof SoftError) return { kind: 'bad_request', message: error.message }

  const err = error as {
    status?: number
    code?: string
    response?: { status?: number; data?: unknown }
    message?: string
  }
  const status = err?.response?.status ?? err?.status
  const raw = err?.response?.data
  const body = (typeof raw === 'string' ? raw : raw ? JSON.stringify(raw) : '').toLowerCase()
  const looksQuota = /usage limit|quota|credit|plan|billing|exceed|insufficient/.test(body)

  switch (status) {
    case 401:
      return { kind: 'invalid', message: 'Key 无效' }
    case 402:
    case 432:
    case 433:
      return { kind: 'quota', message: '额度用完' }
    case 403:
      return looksQuota
        ? { kind: 'quota', message: '额度用完' }
        : { kind: 'invalid', message: 'Key 被拒绝（403）' }
    case 429:
      return looksQuota
        ? { kind: 'quota', message: '额度用完（429）' }
        : { kind: 'rate', message: '请求太频繁（429）' }
    case 400:
    case 422:
      return { kind: 'bad_request', message: `请求参数被拒绝（${status}）` }
    default:
      if (status !== undefined && status >= 500) {
        return { kind: 'transient', message: `服务端错误（${status}）` }
      }
      return { kind: 'transient', message: `网络或超时：${err?.message ?? String(error)}` }
  }
}
