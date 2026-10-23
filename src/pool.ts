import type { Context } from 'koishi'
import type { Config } from './config'
import type { FetchedPage, KeyEntry, NormalizedResult, SearchParams } from './types'
import { classify, FailureKind } from './errors'
import { exaFetch, exaSearch } from './providers/exa'
import { tavilyFetch, tavilySearch } from './providers/tavily'
import { maskKey } from './utils'

interface Slot {
  id: string
  entry: KeyEntry
  cooldownUntil: number
  lastError?: string
  lastKind?: FailureKind
  okCount: number
  failCount: number
}

const COOLDOWN_MS: Record<Exclude<FailureKind, 'quota' | 'bad_request'>, number> = {
  invalid: 24 * 3600_000,
  rate: 60_000,
  transient: 30_000
}

export interface Attempt {
  id: string
  ok: boolean
  message?: string
}

export class AllFailedError extends Error {
  constructor(public attempts: Attempt[]) {
    super(
      attempts.length
        ? `所有搜索 Key 都失败了：${attempts.map((a) => `${a.id} ${a.message}`).join('；')}`
        : '没有可用的搜索 Key，请在插件配置的「密钥」里添加'
    )
  }
}

export class KeyPool {
  private slots: Slot[] = []
  private rr = 0
  private logger

  constructor(private ctx: Context, private config: Config) {
    this.logger = ctx.logger('chatluna-multi-search')
    const counter: Record<string, number> = {}
    this.slots = (config.keys ?? [])
      .filter((k) => k?.apiKey?.trim())
      .map((entry) => {
        counter[entry.provider] = (counter[entry.provider] ?? 0) + 1
        return {
          id: `${entry.provider}#${counter[entry.provider]}`,
          entry: { ...entry, apiKey: entry.apiKey.trim() },
          cooldownUntil: 0,
          okCount: 0,
          failCount: 0
        }
      })
  }

  get enabledCount() {
    return this.slots.filter((s) => s.entry.enabled).length
  }

  /** 本次调用的尝试顺序：可用的在前；全都在冷却则只试冷却最快结束的一个 */
  private order(): Slot[] {
    const now = Date.now()
    const enabled = this.slots.filter((s) => s.entry.enabled)
    let ready = enabled.filter((s) => s.cooldownUntil <= now)
    if (ready.length === 0 && enabled.length > 0) {
      return [[...enabled].sort((a, b) => a.cooldownUntil - b.cooldownUntil)[0]]
    }
    if (this.config.strategy === 'roundRobin' && ready.length > 1) {
      const start = this.rr++ % ready.length
      ready = [...ready.slice(start), ...ready.slice(0, start)]
    }
    return ready
  }

  private async run<T>(op: (slot: Slot) => Promise<T>): Promise<{ value: T; source: string }> {
    const attempts: Attempt[] = []
    for (const slot of this.order()) {
      try {
        const value = await op(slot)
        slot.okCount++
        slot.cooldownUntil = 0
        slot.lastError = undefined
        return { value, source: slot.entry.provider }
      } catch (error) {
        const f = classify(error)
        slot.failCount++
        slot.lastError = f.message
        slot.lastKind = f.kind
        if (f.kind === 'quota') {
          slot.cooldownUntil = Date.now() + this.config.quotaCooldownMinutes * 60_000
        } else if (f.kind !== 'bad_request') {
          slot.cooldownUntil = Date.now() + COOLDOWN_MS[f.kind]
        }
        attempts.push({ id: slot.id, ok: false, message: f.message })
        this.logger.warn(
          `${slot.id} (${maskKey(slot.entry.apiKey)}) 失败：${f.message}，尝试下一个`
        )
      }
    }
    throw new AllFailedError(attempts)
  }

  search(p: SearchParams): Promise<{ value: NormalizedResult[]; source: string }> {
    return this.run((s) =>
      s.entry.provider === 'tavily'
        ? tavilySearch(this.ctx, this.config, s.entry.apiKey, p)
        : exaSearch(this.ctx, this.config, s.entry.apiKey, p)
    )
  }

  fetch(url: string): Promise<{ value: FetchedPage; source: string }> {
    return this.run((s) =>
      s.entry.provider === 'tavily'
        ? tavilyFetch(this.ctx, this.config, s.entry.apiKey, url)
        : exaFetch(this.ctx, this.config, s.entry.apiKey, url)
    )
  }

  resetCooldowns() {
    for (const s of this.slots) {
      s.cooldownUntil = 0
      s.lastError = undefined
    }
  }

  status(): string {
    if (this.slots.length === 0) return '还没有配置任何 Key。'
    const now = Date.now()
    const kindText: Record<FailureKind, string> = {
      quota: '额度用完',
      invalid: 'Key 无效',
      rate: '限流',
      transient: '临时故障',
      bad_request: '请求被拒'
    }
    return this.slots
      .map((s, i) => {
        const note = s.entry.note ? `（${s.entry.note}）` : ''
        let state = '可用'
        if (!s.entry.enabled) state = '已停用'
        else if (s.cooldownUntil > now) {
          const mins = Math.ceil((s.cooldownUntil - now) / 60_000)
          state = `暂停中：${kindText[s.lastKind ?? 'transient']}，约 ${mins} 分钟后重试`
        }
        return `${i + 1}. ${s.id} ${maskKey(s.entry.apiKey)}${note} — ${state}（成功 ${s.okCount} / 失败 ${s.failCount}）`
      })
      .join('\n')
  }
}
