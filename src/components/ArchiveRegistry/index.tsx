import { Card as PostCard } from '@/components/Card'
import { EventCard } from '@/components/EventCard'

export const Registry: {
  [K in CollectionSlug]: React.FC<ArchiveCardProps<any>>
} = {
  posts: PostCard,
  events: EventCard,
}

export type CollectionSlug = 'posts' | 'events'

export interface ArchiveCardProps<D = any> {
  doc: D
  relationTo: CollectionSlug
  showCategories?: boolean
  className?: string
  alignItems?: 'center'
  title?: string
}
