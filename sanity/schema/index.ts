import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { category } from './category'
import { era } from './era'
import { article } from './article'
import { biography } from './biography'
import { museumItem } from './museumItem'
import { land } from './land'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, era, article, biography, museumItem, land, blockContent],
}
