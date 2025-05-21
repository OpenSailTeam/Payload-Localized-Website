import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req: { payload } }) => {
  const { revalidateTag } = await import('next/cache')
  
  payload.logger.info(`Revalidating header`)

  revalidateTag('global_header')

  return doc
}
