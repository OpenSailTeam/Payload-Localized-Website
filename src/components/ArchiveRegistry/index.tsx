import { Card as PostCard } from '@/components/Card'
import { EventCard } from '@/components/EventCard'
import { ZoneCard } from '@/components/ZoneCard'
import { GolfProCard } from '@/components/GolfProCard'

export type CollectionSlug = 'posts' | 'events' | 'zones' | 'golf-pros'

export interface ArchiveCardProps<D = any> {
  doc: D
  relationTo: CollectionSlug
  showCategories?: boolean
  className?: string
  alignItems?: 'center'
  title?: string
}

// Extend the registry to include a label for each collection
export const Registry: {
  [K in CollectionSlug]: {
    component: React.FC<ArchiveCardProps<any>>
    label: string
  }
} = {
  posts: { component: PostCard, label: 'posts' },
  events: { component: EventCard, label: 'events' },
  zones: { component: ZoneCard, label: 'zones' },
  'golf-pros': { component: GolfProCard, label: 'golf-pros' },
}
