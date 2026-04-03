import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { era } from './era'
import { legend } from './legend'
import { biography } from './biography'
import { museumItem } from './museumItem'
import { land } from './land'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [era, legend, biography, museumItem, land, blockContent],
}
