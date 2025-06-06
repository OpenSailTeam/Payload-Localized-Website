
import type { Block } from 'payload'
import { Banner } from '../Banner/config'
import { MediaBlock } from '../MediaBlock/config'
import { Code } from '../Code/config'
import { CallToAction } from '../CallToAction/config'
import { Content } from '../Content/config'
import { Archive } from '../ArchiveBlock/config'
import { FormBlock } from '../Form/config'

export const MultiBlock: Block = {
  slug: 'multiBlock',
  interfaceName: 'MultiBlock',
  labels: {
    singular: 'Multi Block',
    plural: 'Multi Blocks',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'theme',
      type: 'select',
      label: 'Section Theme',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      defaultValue: 'auto',
      required: true,
      admin: {
        description: 'Choose the theme for this section.',
        position: 'sidebar',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Choose an image to display behind this section',
        position: 'sidebar',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Content Blocks',
      blocks: [
        Banner,
        Code,
        MediaBlock,
        CallToAction,
        Content,
        Archive,
        FormBlock,
      ],
      required: true,
      defaultValue: [],
    },
  ],
}
