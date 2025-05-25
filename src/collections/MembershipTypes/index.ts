import type { CollectionConfig } from 'payload';

export const MembershipTypes: CollectionConfig = {
    slug: 'membership-types',
    labels: {
        singular: 'Membership Type',
        plural: 'Membership Types',
    },
    admin: {
        useAsTitle: 'typeName',
    },
    fields: [
        {
            name: 'typeName',
            type: 'text',
            label: 'Membership Type',
            required: true,
        },
    ],
};

export default MembershipTypes;