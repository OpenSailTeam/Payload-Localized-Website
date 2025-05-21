import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({ doc, previousDoc, req: { payload }}) => {

  const { revalidatePath } = await import('next/cache')

  if (doc._status === 'published') {
    const path = `/posts/${doc.slug}`
    payload.logger.info(`Revalidating post at path: ${path}`)
    revalidatePath(path)
  }

  // If the post was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/posts/${previousDoc.slug}`
    payload.logger.info(`Revalidating old post at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}
