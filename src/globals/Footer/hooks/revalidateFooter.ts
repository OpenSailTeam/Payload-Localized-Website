import type { GlobalAfterChangeHook } from 'payload'

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  const { revalidateTag } = await import('next/cache')

  payload.logger.info(`Revalidating footer`)

  revalidateTag('global_footer')

  return doc
}
