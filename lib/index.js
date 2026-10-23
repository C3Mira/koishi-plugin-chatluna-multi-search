var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../multi/src/index.ts
var index_exports = {};
__export(index_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  usage: () => usage
});
module.exports = __toCommonJS(index_exports);

// ../multi/src/config.ts
var import_koishi = require("koishi");
var Config = import_koishi.Schema.intersect([
  import_koishi.Schema.object({
    keys: import_koishi.Schema.array(
      import_koishi.Schema.object({
        provider: import_koishi.Schema.union([
          import_koishi.Schema.const("tavily").description("Tavily"),
          import_koishi.Schema.const("exa").description("Exa")
        ]).default("tavily").description("\u641C\u7D22\u670D\u52A1"),
        apiKey: import_koishi.Schema.string().role("secret").required().description("API Key"),
        enabled: import_koishi.Schema.boolean().default(true).description("\u542F\u7528\uFF08\u60F3\u505C\u7528\u67D0\u4E2A\u5C31\u5173\u6389\uFF09"),
        note: import_koishi.Schema.string().default("").description("\u5907\u6CE8\uFF08\u53EF\u9009\uFF0C\u5982\u300C\u5C0F\u53F71\u300D\uFF09")
      })
    ).default([]).description(
      "\u5BC6\u94A5\u5217\u8868\uFF1A\u6309\u4ECE\u4E0A\u5230\u4E0B\u7684\u987A\u5E8F\u4F7F\u7528\uFF0C\u524D\u4E00\u4E2A\u5931\u8D25\u6216\u989D\u5EA6\u7528\u5B8C\u4F1A\u81EA\u52A8\u6362\u4E0B\u4E00\u4E2A\u3002\u53EF\u6DF7\u586B Tavily \u548C Exa\uFF0C\u4E5F\u53EF\u540C\u4E00\u670D\u52A1\u586B\u591A\u4E2A Key\u3002"
    )
  }).description("\u5BC6\u94A5"),
  import_koishi.Schema.object({
    strategy: import_koishi.Schema.union([
      import_koishi.Schema.const("priority").description("\u4F18\u5148\u7EA7\uFF1A\u59CB\u7EC8\u5148\u7528\u6700\u4E0A\u9762\u7684\u53EF\u7528 Key"),
      import_koishi.Schema.const("roundRobin").description("\u8F6E\u8BE2\uFF1A\u5728\u53EF\u7528 Key \u4E4B\u95F4\u8F6E\u6D41\uFF0C\u5206\u644A\u989D\u5EA6")
    ]).default("priority").description("\u4F7F\u7528\u7B56\u7565"),
    requestTimeout: import_koishi.Schema.number().role("ms").default(15e3).description("\u5355\u6B21\u8BF7\u6C42\u8D85\u65F6\uFF08\u8D85\u65F6\u4F1A\u6362\u4E0B\u4E00\u4E2A Key\uFF09"),
    quotaCooldownMinutes: import_koishi.Schema.number().min(1).default(720).description("\u989D\u5EA6\u7528\u5B8C\u7684 Key \u6682\u505C\u4F7F\u7528\u591A\u4E45\uFF08\u5206\u949F\uFF09\u3002\u6708\u5EA6\u989D\u5EA6\u5EFA\u8BAE\u4FDD\u6301\u8F83\u957F"),
    cacheMinutes: import_koishi.Schema.number().min(0).default(10).description("\u76F8\u540C\u641C\u7D22\u7684\u7F13\u5B58\u65F6\u95F4\uFF08\u5206\u949F\uFF09\uFF0C\u7701\u989D\u5EA6\uFF1B0 \u4E3A\u5173\u95ED")
  }).description("\u7B56\u7565"),
  import_koishi.Schema.object({
    searchEnabled: import_koishi.Schema.boolean().default(true).description("\u542F\u7528\u641C\u7D22\u5DE5\u5177"),
    searchMaxCount: import_koishi.Schema.number().min(1).max(20).default(5).description("\u5355\u6B21\u641C\u7D22\u7ED3\u679C\u4E0A\u9650"),
    snippetLength: import_koishi.Schema.number().default(800).description("\u5355\u6761\u6458\u8981\u5B57\u7B26\u4E0A\u9650"),
    allowSearchContent: import_koishi.Schema.boolean().default(false).description("\u5141\u8BB8\u8FD4\u56DE\u7F51\u9875\u6B63\u6587"),
    searchContentLength: import_koishi.Schema.number().default(2e3).description("\u5355\u6761\u6B63\u6587\u622A\u65AD\u957F\u5EA6")
  }).description("\u641C\u7D22\u5DE5\u5177"),
  import_koishi.Schema.object({
    fetchEnabled: import_koishi.Schema.boolean().default(true).description("\u542F\u7528\u7F51\u9875\u8BFB\u53D6\u5DE5\u5177"),
    fetchContentLength: import_koishi.Schema.number().default(15e3).description("\u7F51\u9875\u6B63\u6587\u622A\u65AD\u957F\u5EA6")
  }).description("\u7F51\u9875\u8BFB\u53D6\u5DE5\u5177"),
  import_koishi.Schema.object({
    tavilyBaseUrl: import_koishi.Schema.string().default("https://api.tavily.com").description("Tavily \u63A5\u53E3\u5730\u5740"),
    tavilySearchDepth: import_koishi.Schema.union([
      import_koishi.Schema.const("basic").description("basic\uFF1A\u5FEB\u3001\u7701\u989D\u5EA6"),
      import_koishi.Schema.const("advanced").description("advanced\uFF1A\u66F4\u51C6\uFF0C\u66F4\u8017\u989D\u5EA6")
    ]).default("basic").description("Tavily \u641C\u7D22\u6DF1\u5EA6"),
    exaBaseUrl: import_koishi.Schema.string().default("https://api.exa.ai").description("Exa \u63A5\u53E3\u5730\u5740"),
    exaSearchType: import_koishi.Schema.union([
      import_koishi.Schema.const("auto").description("auto\uFF1A\u7EFC\u5408\u8D28\u91CF\u4E0E\u901F\u5EA6"),
      import_koishi.Schema.const("fast").description("fast\uFF1A\u66F4\u5FEB")
    ]).default("auto").description("Exa \u641C\u7D22\u7C7B\u578B")
  }).description("\u9AD8\u7EA7")
]);

// ../multi/src/errors.ts
var SoftError = class extends Error {
};
function classify(error) {
  if (error instanceof SoftError) return { kind: "bad_request", message: error.message };
  const err = error;
  const status = err?.response?.status ?? err?.status;
  const raw = err?.response?.data;
  const body = (typeof raw === "string" ? raw : raw ? JSON.stringify(raw) : "").toLowerCase();
  const looksQuota = /usage limit|quota|credit|plan|billing|exceed|insufficient/.test(body);
  switch (status) {
    case 401:
      return { kind: "invalid", message: "Key \u65E0\u6548" };
    case 402:
    case 432:
    case 433:
      return { kind: "quota", message: "\u989D\u5EA6\u7528\u5B8C" };
    case 403:
      return looksQuota ? { kind: "quota", message: "\u989D\u5EA6\u7528\u5B8C" } : { kind: "invalid", message: "Key \u88AB\u62D2\u7EDD\uFF08403\uFF09" };
    case 429:
      return looksQuota ? { kind: "quota", message: "\u989D\u5EA6\u7528\u5B8C\uFF08429\uFF09" } : { kind: "rate", message: "\u8BF7\u6C42\u592A\u9891\u7E41\uFF08429\uFF09" };
    case 400:
    case 422:
      return { kind: "bad_request", message: `\u8BF7\u6C42\u53C2\u6570\u88AB\u62D2\u7EDD\uFF08${status}\uFF09` };
    default:
      if (status !== void 0 && status >= 500) {
        return { kind: "transient", message: `\u670D\u52A1\u7AEF\u9519\u8BEF\uFF08${status}\uFF09` };
      }
      return { kind: "transient", message: `\u7F51\u7EDC\u6216\u8D85\u65F6\uFF1A${err?.message ?? String(error)}` };
  }
}

// ../multi/src/utils.ts
function truncateText(text, maxLength) {
  if (maxLength <= 0 || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...[truncated]`;
}
function maskKey(key) {
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}\u2026${key.slice(-4)}`;
}
function isPublicHttpUrl(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
  if (h === "[::1]" || h === "::1" || /^\[?(fc|fd|fe80)/.test(h)) return false;
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 0 || a === 10 || a === 127 || a === 169 && b === 254 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a >= 224) {
      return false;
    }
  }
  return true;
}
function sinceDate(days) {
  return new Date(Date.now() - days * 864e5);
}

// ../multi/src/providers/exa.ts
var base = (c) => c.exaBaseUrl.replace(/\/+$/, "");
var headers = (key) => ({
  "Content-Type": "application/json",
  "x-api-key": key
});
async function exaSearch(ctx, config, key, p) {
  const body = {
    query: p.query,
    type: config.exaSearchType,
    numResults: p.count,
    contents: p.needContent ? { text: { maxCharacters: config.searchContentLength } } : { highlights: { maxCharacters: config.snippetLength } }
  };
  if (p.topic === "news") body.category = "news";
  if (p.includeDomains?.length) body.includeDomains = p.includeDomains;
  if (p.excludeDomains?.length) body.excludeDomains = p.excludeDomains;
  if (p.recencyDays) body.startPublishedDate = sinceDate(p.recencyDays).toISOString();
  const data = await ctx.http.post(`${base(config)}/search`, body, {
    headers: headers(key),
    timeout: config.requestTimeout
  });
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((r) => {
    const item = {
      title: r.title ?? null,
      url: r.url,
      date: r.publishedDate?.slice(0, 10) ?? null
    };
    if (r.highlights?.length) {
      item.snippet = truncateText(r.highlights.join("\n"), config.snippetLength);
    }
    if (p.needContent && r.text) {
      item.content = truncateText(String(r.text), config.searchContentLength);
    }
    return item;
  });
}
async function exaFetch(ctx, config, key, url) {
  const data = await ctx.http.post(
    `${base(config)}/contents`,
    { urls: [url], text: { maxCharacters: config.fetchContentLength } },
    { headers: headers(key), timeout: config.requestTimeout }
  );
  const page = data?.results?.[0];
  if (!page?.text) throw new SoftError("Exa \u672A\u80FD\u8BFB\u53D6\u8BE5\u9875\u9762");
  return { title: page.title ?? null, content: String(page.text) };
}

// ../multi/src/providers/tavily.ts
var base2 = (c) => c.tavilyBaseUrl.replace(/\/+$/, "");
var headers2 = (key) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${key}`
});
async function tavilySearch(ctx, config, key, p) {
  const body = {
    query: p.query,
    search_depth: config.tavilySearchDepth,
    max_results: p.count,
    topic: p.topic
  };
  if (p.includeDomains?.length) body.include_domains = p.includeDomains;
  if (p.excludeDomains?.length) body.exclude_domains = p.excludeDomains;
  if (p.recencyDays) body.start_date = sinceDate(p.recencyDays).toISOString().slice(0, 10);
  if (p.needContent) body.include_raw_content = true;
  const data = await ctx.http.post(`${base2(config)}/search`, body, {
    headers: headers2(key),
    timeout: config.requestTimeout
  });
  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((r) => {
    const item = {
      title: r.title ?? null,
      url: r.url,
      date: (r.published_date ?? r.publishedDate ?? null)?.toString().slice(0, 10) ?? null,
      snippet: r.content ? truncateText(String(r.content), config.snippetLength) : void 0
    };
    if (p.needContent && r.raw_content) {
      item.content = truncateText(String(r.raw_content), config.searchContentLength);
    }
    return item;
  });
}
async function tavilyFetch(ctx, config, key, url) {
  const data = await ctx.http.post(
    `${base2(config)}/extract`,
    { urls: [url] },
    { headers: headers2(key), timeout: config.requestTimeout }
  );
  const page = data?.results?.[0];
  if (!page?.raw_content) {
    const why = data?.failed_results?.[0]?.error;
    throw new SoftError(`Tavily \u672A\u80FD\u8BFB\u53D6\u8BE5\u9875\u9762${why ? `\uFF1A${why}` : ""}`);
  }
  return { title: null, content: String(page.raw_content) };
}

// ../multi/src/pool.ts
var COOLDOWN_MS = {
  invalid: 24 * 36e5,
  rate: 6e4,
  transient: 3e4
};
var AllFailedError = class extends Error {
  constructor(attempts) {
    super(
      attempts.length ? `\u6240\u6709\u641C\u7D22 Key \u90FD\u5931\u8D25\u4E86\uFF1A${attempts.map((a) => `${a.id} ${a.message}`).join("\uFF1B")}` : "\u6CA1\u6709\u53EF\u7528\u7684\u641C\u7D22 Key\uFF0C\u8BF7\u5728\u63D2\u4EF6\u914D\u7F6E\u7684\u300C\u5BC6\u94A5\u300D\u91CC\u6DFB\u52A0"
    );
    this.attempts = attempts;
  }
  attempts;
};
var KeyPool = class {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.logger = ctx.logger("chatluna-multi-search");
    const counter = {};
    this.slots = (config.keys ?? []).filter((k) => k?.apiKey?.trim()).map((entry) => {
      counter[entry.provider] = (counter[entry.provider] ?? 0) + 1;
      return {
        id: `${entry.provider}#${counter[entry.provider]}`,
        entry: { ...entry, apiKey: entry.apiKey.trim() },
        cooldownUntil: 0,
        okCount: 0,
        failCount: 0
      };
    });
  }
  ctx;
  config;
  slots = [];
  rr = 0;
  logger;
  get enabledCount() {
    return this.slots.filter((s) => s.entry.enabled).length;
  }
  /** 本次调用的尝试顺序：可用的在前；全都在冷却则只试冷却最快结束的一个 */
  order() {
    const now = Date.now();
    const enabled = this.slots.filter((s) => s.entry.enabled);
    let ready = enabled.filter((s) => s.cooldownUntil <= now);
    if (ready.length === 0 && enabled.length > 0) {
      return [[...enabled].sort((a, b) => a.cooldownUntil - b.cooldownUntil)[0]];
    }
    if (this.config.strategy === "roundRobin" && ready.length > 1) {
      const start = this.rr++ % ready.length;
      ready = [...ready.slice(start), ...ready.slice(0, start)];
    }
    return ready;
  }
  async run(op) {
    const attempts = [];
    for (const slot of this.order()) {
      try {
        const value = await op(slot);
        slot.okCount++;
        slot.cooldownUntil = 0;
        slot.lastError = void 0;
        return { value, source: slot.entry.provider };
      } catch (error) {
        const f = classify(error);
        slot.failCount++;
        slot.lastError = f.message;
        slot.lastKind = f.kind;
        if (f.kind === "quota") {
          slot.cooldownUntil = Date.now() + this.config.quotaCooldownMinutes * 6e4;
        } else if (f.kind !== "bad_request") {
          slot.cooldownUntil = Date.now() + COOLDOWN_MS[f.kind];
        }
        attempts.push({ id: slot.id, ok: false, message: f.message });
        this.logger.warn(
          `${slot.id} (${maskKey(slot.entry.apiKey)}) \u5931\u8D25\uFF1A${f.message}\uFF0C\u5C1D\u8BD5\u4E0B\u4E00\u4E2A`
        );
      }
    }
    throw new AllFailedError(attempts);
  }
  search(p) {
    return this.run(
      (s) => s.entry.provider === "tavily" ? tavilySearch(this.ctx, this.config, s.entry.apiKey, p) : exaSearch(this.ctx, this.config, s.entry.apiKey, p)
    );
  }
  fetch(url) {
    return this.run(
      (s) => s.entry.provider === "tavily" ? tavilyFetch(this.ctx, this.config, s.entry.apiKey, url) : exaFetch(this.ctx, this.config, s.entry.apiKey, url)
    );
  }
  resetCooldowns() {
    for (const s of this.slots) {
      s.cooldownUntil = 0;
      s.lastError = void 0;
    }
  }
  status() {
    if (this.slots.length === 0) return "\u8FD8\u6CA1\u6709\u914D\u7F6E\u4EFB\u4F55 Key\u3002";
    const now = Date.now();
    const kindText = {
      quota: "\u989D\u5EA6\u7528\u5B8C",
      invalid: "Key \u65E0\u6548",
      rate: "\u9650\u6D41",
      transient: "\u4E34\u65F6\u6545\u969C",
      bad_request: "\u8BF7\u6C42\u88AB\u62D2"
    };
    return this.slots.map((s, i) => {
      const note = s.entry.note ? `\uFF08${s.entry.note}\uFF09` : "";
      let state = "\u53EF\u7528";
      if (!s.entry.enabled) state = "\u5DF2\u505C\u7528";
      else if (s.cooldownUntil > now) {
        const mins = Math.ceil((s.cooldownUntil - now) / 6e4);
        state = `\u6682\u505C\u4E2D\uFF1A${kindText[s.lastKind ?? "transient"]}\uFF0C\u7EA6 ${mins} \u5206\u949F\u540E\u91CD\u8BD5`;
      }
      return `${i + 1}. ${s.id} ${maskKey(s.entry.apiKey)}${note} \u2014 ${state}\uFF08\u6210\u529F ${s.okCount} / \u5931\u8D25 ${s.failCount}\uFF09`;
    }).join("\n");
  }
};

// ../multi/src/cache.ts
var TtlCache = class {
  constructor(ttlMs, max = 100) {
    this.ttlMs = ttlMs;
    this.max = max;
  }
  ttlMs;
  max;
  map = /* @__PURE__ */ new Map();
  get(key) {
    if (this.ttlMs <= 0) return void 0;
    const hit = this.map.get(key);
    if (!hit) return void 0;
    if (Date.now() - hit.at > this.ttlMs) {
      this.map.delete(key);
      return void 0;
    }
    return hit.value;
  }
  set(key, value) {
    if (this.ttlMs <= 0) return;
    if (this.map.size >= this.max) {
      const first = this.map.keys().next().value;
      if (first !== void 0) this.map.delete(first);
    }
    this.map.set(key, { at: Date.now(), value });
  }
};

// ../multi/src/vendor.ts
var import_module = require("module");
var nodeRequire = (0, import_module.createRequire)(__filename);
var StructuredTool = nodeRequire("@langchain/core/tools").StructuredTool;
var z = nodeRequire("zod").z;

// ../multi/src/tools/search.ts
var Schema2 = z.object({
  query: z.string().describe("Search query. A clear, descriptive phrase works best (not just keywords)."),
  count: z.number().int().min(1).max(20).optional().describe("Number of results to return."),
  topic: z.enum(["general", "news"]).optional().describe('Use "news" for recent events and breaking news; default "general".'),
  recencyDays: z.number().int().min(1).max(365).optional().describe("Only return pages published within the last N days. Useful for time-sensitive questions."),
  includeDomains: z.array(z.string()).optional().describe("Only return results from these domains."),
  excludeDomains: z.array(z.string()).optional().describe("Exclude results from these domains."),
  needContent: z.boolean().optional().describe("Set true to include page text in each result, only works when allowed by config.")
});
var SEARCH_TOOL_NAME = "smart_web_search";
var SEARCH_TOOL_DESCRIPTION = "Search the web for real-time or factual information (news, prices, versions, current events, anything that may have changed or you are unsure about). Returns results with title, url, snippet and publish date. Use it BEFORE answering when facts must be current or verifiable; do not guess.";
var SmartWebSearchTool = class extends StructuredTool {
  constructor(ctx, config, pool, cache) {
    super();
    this.ctx = ctx;
    this.config = config;
    this.pool = pool;
    this.cache = cache;
  }
  ctx;
  config;
  pool;
  cache;
  name = SEARCH_TOOL_NAME;
  description = SEARCH_TOOL_DESCRIPTION;
  schema = Schema2;
  async _call(input, _runManager, _config) {
    const query = input.query?.trim();
    if (!query) return "Error: empty query.";
    const maxCount = Math.min(this.config.searchMaxCount, 20);
    const params = {
      query,
      count: Math.min(Math.max(input.count ?? maxCount, 1), maxCount),
      topic: input.topic ?? "general",
      recencyDays: input.recencyDays,
      includeDomains: input.includeDomains,
      excludeDomains: input.excludeDomains,
      needContent: input.needContent === true && this.config.allowSearchContent
    };
    const cacheKey = `s:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    try {
      const { value, source } = await this.pool.search(params);
      if (value.length === 0) return "No results found for the given query.";
      const out = JSON.stringify({
        current_time: (/* @__PURE__ */ new Date()).toISOString(),
        query,
        source,
        results: value
      });
      this.cache.set(cacheKey, out);
      return out;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      return `Error: ${msg}. Tell the user you cannot search right now; do not make up results.`;
    }
  }
};

// ../multi/src/tools/fetch.ts
var Schema3 = z.object({
  url: z.string().describe("The public http or https URL of the web page to read.")
});
var FETCH_TOOL_NAME = "smart_web_fetch";
var FETCH_TOOL_DESCRIPTION = "Read a single web page and return its main text. Use it after smart_web_search when the snippets are not enough.";
var SmartWebFetchTool = class extends StructuredTool {
  constructor(ctx, config, pool, cache) {
    super();
    this.ctx = ctx;
    this.config = config;
    this.pool = pool;
    this.cache = cache;
  }
  ctx;
  config;
  pool;
  cache;
  name = FETCH_TOOL_NAME;
  description = FETCH_TOOL_DESCRIPTION;
  schema = Schema3;
  async _call(input, _runManager, _config) {
    const url = input.url?.trim();
    if (!url || !isPublicHttpUrl(url)) {
      return "Error: only public http and https URLs are supported";
    }
    const cacheKey = `f:${url}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;
    try {
      const { value } = await this.pool.fetch(url);
      const out = `# ${value.title || new URL(url).hostname}

${truncateText(
        value.content,
        this.config.fetchContentLength
      )}`;
      this.cache.set(cacheKey, out);
      return out;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
};

// ../multi/src/index.ts
var name = "chatluna-multi-search";
var usage = `\u4E3A chatluna \u63D0\u4F9B\u8054\u7F51\u641C\u7D22\uFF08Tavily + Exa\uFF09\uFF0C\u652F\u6301\u591A\u4E2A Key \u81EA\u52A8\u5207\u6362\u3002

\u524D\u7F6E\u8981\u6C42\uFF1A\u5DF2\u5B89\u88C5\u5E76\u542F\u7528 koishi-plugin-chatluna\u3002

**\u7528\u6CD5**\uFF1A\u5728\u300C\u5BC6\u94A5\u300D\u91CC\u6309\u987A\u5E8F\u6DFB\u52A0 Key\uFF08Tavily \u548C Exa \u53EF\u6DF7\u7528\uFF09\u3002\u524D\u4E00\u4E2A\u51FA\u9519\u3001\u989D\u5EA6\u7528\u5B8C\u6216\u88AB\u9650\u6D41\uFF0C\u4F1A\u81EA\u52A8\u6362\u4E0B\u4E00\u4E2A\uFF0C\u65E0\u9700\u4EBA\u5DE5\u5904\u7406\u3002\u4E0D\u60F3\u7528\u67D0\u4E2A\u5C31\u628A\u5B83\u300C\u542F\u7528\u300D\u5173\u6389\u3002

**\u7BA1\u7406\u547D\u4EE4**\uFF08\u9700\u8981 3 \u7EA7\u6743\u9650\uFF09\uFF1A
- websearch.status\uFF1A\u67E5\u770B\u6BCF\u4E2A Key \u7684\u72B6\u6001
- websearch.test \u5173\u952E\u8BCD\uFF1A\u76F4\u63A5\u6D4B\u8BD5\u4E00\u6B21\u641C\u7D22
- websearch.reset\uFF1A\u6E05\u9664\u6240\u6709\u6682\u505C\u72B6\u6001

\u6CE8\u518C\u7684\u5DE5\u5177\uFF1Asmart_web_search\uFF08\u641C\u7D22\uFF09\u3001smart_web_fetch\uFF08\u8BFB\u7F51\u9875\uFF09\u3002`;
var inject = { required: ["chatluna"] };
var meta = (tags) => ({
  source: "extension",
  group: "search",
  tags,
  defaultAvailability: {
    enabled: true,
    main: true,
    chatluna: true,
    characterScope: "all"
  }
});
function apply(ctx, config) {
  const logger = ctx.logger("chatluna-multi-search");
  const pool = new KeyPool(ctx, config);
  const cache = new TtlCache(config.cacheMinutes * 6e4);
  if (pool.enabledCount === 0) {
    logger.warn("\u6CA1\u6709\u542F\u7528\u7684 Key\uFF1A\u8BF7\u5728\u63D2\u4EF6\u914D\u7F6E\u300C\u5BC6\u94A5\u300D\u91CC\u6DFB\u52A0 Tavily / Exa \u7684 API Key");
  }
  if (config.searchEnabled) {
    ctx.effect(
      () => ctx.chatluna.platform.registerTool(SEARCH_TOOL_NAME, {
        description: SEARCH_TOOL_DESCRIPTION,
        createTool: () => new SmartWebSearchTool(ctx, config, pool, cache),
        selector: () => true,
        meta: meta(["web-search", "tavily", "exa"])
      })
    );
  }
  if (config.fetchEnabled) {
    ctx.effect(
      () => ctx.chatluna.platform.registerTool(FETCH_TOOL_NAME, {
        description: FETCH_TOOL_DESCRIPTION,
        createTool: () => new SmartWebFetchTool(ctx, config, pool, cache),
        selector: () => true,
        meta: meta(["web-fetch", "tavily", "exa"])
      })
    );
  }
  ctx.command("websearch.status", "\u67E5\u770B\u641C\u7D22 Key \u7684\u72B6\u6001", { authority: 3 }).action(() => pool.status());
  ctx.command("websearch.reset", "\u6E05\u9664\u6240\u6709 Key \u7684\u6682\u505C\u72B6\u6001", { authority: 3 }).action(() => {
    pool.resetCooldowns();
    return "\u5DF2\u6E05\u9664\u3002";
  });
  ctx.command("websearch.test <query:text>", "\u76F4\u63A5\u6D4B\u8BD5\u4E00\u6B21\u641C\u7D22\uFF08\u4F1A\u6D88\u8017\u989D\u5EA6\uFF09", { authority: 3 }).action(async (_, query) => {
    if (!query?.trim()) return "\u7528\u6CD5\uFF1Awebsearch.test \u5173\u952E\u8BCD";
    try {
      const { value, source } = await pool.search({
        query: query.trim(),
        count: 3,
        topic: "general",
        needContent: false
      });
      if (!value.length) return `\uFF08${source}\uFF09\u6CA1\u6709\u7ED3\u679C\u3002`;
      return `\u6765\u6E90\uFF1A${source}
` + value.map((r, i) => `${i + 1}. ${r.title ?? "(\u65E0\u6807\u9898)"}
${r.url}${r.date ? `
${r.date}` : ""}`).join("\n\n");
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name,
  usage
});
