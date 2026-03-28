import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { category } from './category'
import { era } from './era'
import { article } from './article'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, era, article, blockContent],
}
