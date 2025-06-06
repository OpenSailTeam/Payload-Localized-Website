import type { CollectionAfterChangeHook } from 'payload'
import type { Event } from '../../../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = async ({ doc, previousDoc, req: { payload }}) => {
  // When an event is published, revalidate its preview page
  const { revalidatePath } = await import('next/cache')
  
  if (doc._status === 'published') {
    const path = `/events/${doc.slug}`
    payload.logger.info(`Revalidating event at path: ${path}`)
    revalidatePath(path)
  }

  // If an event was unpublished or its slug changed, revalidate the old URL
  if (previousDoc._status === 'published' &&(doc._status !== 'published' || previousDoc.slug !== doc.slug)) {
    const oldPath = `/events/${previousDoc.slug}`
    payload.logger.info(`Revalidating old event at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}
