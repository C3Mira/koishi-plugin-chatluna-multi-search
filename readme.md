# koishi-plugin-chatluna-multi-search

为 chatluna 提供联网搜索：**Tavily + Exa 二合一，支持多个 Key，额度用完自动切换**。
结构改自 PinkElysiaDev/chatluna-deepseek-search（Apache-2.0）。

## 工具

| 工具 | 能力 |
|---|---|
| smart_web_search | 搜索，可选新闻主题、最近 N 天、域名过滤，返回标题/链接/摘要/日期 |
| smart_web_fetch | 读取单个网页正文（拒绝内网地址） |

## 自动切换逻辑

密钥列表从上到下依次使用，出错就换下一个：

| 情况 | 处理 |
|---|---|
| 额度用完（402/432/433，或带额度提示的 429/403） | 暂停该 Key（默认 12 小时） |
| Key 无效（401） | 暂停 24 小时 |
| 限流（429） | 暂停 1 分钟 |
| 超时 / 服务端错误 | 暂停 30 秒 |
| 页面读取失败、参数被拒 | 不惩罚 Key，直接换下一个试 |

全部 Key 都在暂停时，会试一次最快恢复的那个，不会彻底卡死。
相同搜索 10 分钟内走缓存，不重复扣额度。

## 管理命令（权限 3）

- `websearch.status` 查看每个 Key 的状态与成败次数
- `websearch.test 关键词` 直接测试（会消耗一次额度）
- `websearch.reset` 清除暂停状态

## koishi.yml 示例

```yaml
chatluna-multi-search:
  keys:
    - provider: tavily
      apiKey: tvly-xxxxxxxx
    - provider: exa
      apiKey: xxxxxxxx
    - provider: tavily
      apiKey: tvly-yyyyyyyy
      note: 小号
  strategy: priority
```

## 免编译安装

整个文件夹复制到 `<Koishi目录>/node_modules/koishi-plugin-chatluna-multi-search/`，重启 Koishi。
`lib/index.js` 已编译好，`src/` 为源码。
