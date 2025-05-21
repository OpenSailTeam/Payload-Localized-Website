import type { CollectionAfterChangeHook } from 'payload'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  const { revalidateTag } = await import('next/cache')

  payload.logger.info(`Revalidating redirects`)

  revalidateTag('redirects')

  return doc
}
