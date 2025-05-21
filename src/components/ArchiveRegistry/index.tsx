import { Card as PostCard } from '@/components/Card'
import { EventCard } from '@/components/EventCard'
import { ZoneCard } from '@/components/ZoneCard'

export const Registry: {
  [K in CollectionSlug]: React.FC<ArchiveCardProps<any>>
} = {
  posts: PostCard,
  events: EventCard,
  zones: ZoneCard,
}

export type CollectionSlug = 'posts' | 'events' | 'zones'

export interface ArchiveCardProps<D = any> {
  doc: D
  relationTo: CollectionSlug
  showCategories?: boolean
  className?: string
  alignItems?: 'center'
  title?: string
}
