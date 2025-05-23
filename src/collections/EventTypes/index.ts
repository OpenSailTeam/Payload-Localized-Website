import type { CollectionConfig } from 'payload';

export const EventTypes: CollectionConfig = {
    slug: 'event-types',
    labels: {
        singular: 'Event Type',
        plural: 'Event Types',
    },
    admin: {
        useAsTitle: 'typeName',
    },
    fields: [
        {
            name: 'typeName',
            type: 'text',
            label: 'Event Type',
            required: true,
        },
    ],
};

export default EventTypes;