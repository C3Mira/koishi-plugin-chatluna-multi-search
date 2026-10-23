import { createRequire } from 'module'

const nodeRequire = createRequire(__filename)

/** 复用宿主 chatluna 依赖闭包中的实例，避免双包导致 instanceof 失效 */
export const StructuredTool: typeof import('@langchain/core/tools')['StructuredTool'] = (
  nodeRequire('@langchain/core/tools') as typeof import('@langchain/core/tools')
).StructuredTool
export const z: typeof import('zod')['z'] = (nodeRequire('zod') as typeof import('zod')).z
