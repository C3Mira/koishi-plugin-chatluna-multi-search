/** 极简 TTL 缓存：相同搜索短时间内不重复扣额度 */
export class TtlCache {
  private map = new Map<string, { at: number; value: string }>()
  constructor(private ttlMs: number, private max = 100) {}

  get(key: string): string | undefined {
    if (this.ttlMs <= 0) return undefined
    const hit = this.map.get(key)
    if (!hit) return undefined
    if (Date.now() - hit.at > this.ttlMs) {
      this.map.delete(key)
      return undefined
    }
    return hit.value
  }

  set(key: string, value: string) {
    if (this.ttlMs <= 0) return
    if (this.map.size >= this.max) {
      const first = this.map.keys().next().value
      if (first !== undefined) this.map.delete(first)
    }
    this.map.set(key, { at: Date.now(), value })
  }
}
