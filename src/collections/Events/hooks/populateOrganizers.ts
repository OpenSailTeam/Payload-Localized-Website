import type { CollectionAfterReadHook } from 'payload'
import { User } from 'src/payload-types'

// The `user` collection is access‑locked, so we populate organizers manually
// into our `populatedOrganizers` array for admin/UI use.
export const populateOrganizers: CollectionAfterReadHook = async ({
  doc,
  req,
  req: { payload },
}) => {
  if (doc?.organizers) {
    const organizerDocs: User[] = []

    for (const organizer of doc.organizers) {
      const orgDoc = await payload.findByID({
        id: typeof organizer === 'object' ? organizer?.id : organizer,
        collection: 'users',
        depth: 0,
        req,
      })
      organizerDocs.push(orgDoc)
    }

    doc.populatedOrganizers = organizerDocs.map((user) => ({
      id: user.id,
      name: user.name,
    }))
  }

  return doc
}
