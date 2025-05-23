import type { CollectionConfig } from 'payload';

export const SubTypes: CollectionConfig = {
    slug: 'sub-types',
    labels: {
        singular: 'Sub Type',
        plural: 'Sub Types',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Sub Type Name',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Description',
        },
        {
            name: 'eventType',
            type: 'relationship',
            relationTo: 'event-types',
            label: 'Parent Event Type',
            required: true,
        },
    ],
};

export default SubTypes;