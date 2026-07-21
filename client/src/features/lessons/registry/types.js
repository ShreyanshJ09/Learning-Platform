/**
 * JSDoc contracts for block registry components.
 * Runtime validation of `block` shapes lives in features/lessons/schemas.js.
 *
 * @typedef {import('@/features/lessons/types.js').ContentBlock} ContentBlock
 * @typedef {import('@/features/lessons/types.js').UnknownBlock} UnknownBlock
 *
 * @typedef {{
 *   block: ContentBlock | UnknownBlock,
 *   index: number,
 *   className?: string,
 * }} BlockProps
 *
 * @typedef {(props: BlockProps) => import('react').ReactNode} BlockComponent
 */

export {}
