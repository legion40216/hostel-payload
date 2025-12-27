import type { CollectionConfig } from 'payload'

export const Hostels: CollectionConfig = {
  slug: "hostels",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "area", "rentPerBed", "availableBeds", "roomType"],
  },
  access: {
    read: () => true, // Public can read
    create: ({ req: { user } }: { req: { user: any } }) => !!user, // Only logged-in users can create
    update: ({ req: { user } }: { req: { user: any } }) => !!user,
    delete: ({ req: { user } }: { req: { user: any } }) => !!user,
  },
  fields: [
    // Basic Info
    {
      name: "name",
      type: "text",
      required: true,
      label: "Hostel Name",
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Description",
    },

    // Address Group
    {
      name: "address",
      type: "group",
      fields: [
        {
          name: "street",
          type: "text",
          required: true,
        },
        {
          name: "area",
          type: "select",
          required: true,
          options: [
            { label: "Saddar", value: "Saddar" },
            { label: "Latifabad", value: "Latifabad" },
            { label: "Qasimabad", value: "Qasimabad" },
            { label: "Near University", value: "Near University" },
            { label: "Cantonment", value: "Cantonment" },
          ],
        },
        {
          name: "city",
          type: "text",
          required: true,
          defaultValue: "Hyderabad",
        },
        {
          name: "postalCode",
          type: "text",
          required: true,
        },
      ],
    },

    // Images
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Thumbnail Image",
    },
    {
      name: "images",
      type: "array",
      label: "Gallery Images",
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },

    // Room Details
    {
      name: "totalRooms",
      type: "number",
      required: true,
      min: 1,
    },
    {
      name: "totalBeds",
      type: "number",
      required: true,
      min: 1,
    },
    {
      name: "occupiedBeds",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "availableBeds",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "This will be auto-calculated: totalBeds - occupiedBeds",
      },
    },
    {
      name: "bedsPerRoom",
      type: "select",
      required: true,
      options: [
        { label: "Single (1 bed)", value: "single" },
        { label: "Double (2 beds)", value: "double" },
        { label: "Triple (3+ beds)", value: "triple" },
      ],
    },
    {
      name: "roomType",
      type: "select",
      required: true,
      options: [
        { label: "Male Only", value: "male" },
        { label: "Female Only", value: "female" },
        { label: "Mixed/Co-ed", value: "mixed" },
      ],
    },

    // Pricing
    {
      name: "rentPerBed",
      type: "number",
      required: true,
      min: 0,
      label: "Rent Per Bed (PKR/month)",
    },
    {
      name: "securityDeposit",
      type: "number",
      required: true,
      min: 0,
      label: "Security Deposit (PKR)",
    },

    // Facilities
    {
      name: "facilities",
      type: "select",
      hasMany: true,
      required: true,
      options: [
        { label: "WiFi", value: "WiFi" },
        { label: "AC", value: "AC" },
        { label: "Laundry", value: "Laundry" },
        { label: "Kitchen", value: "Kitchen" },
        { label: "24/7 Security", value: "24/7 Security" },
        { label: "Attached Bathroom", value: "Attached Bathroom" },
        { label: "Parking", value: "Parking" },
        { label: "Generator/UPS", value: "Generator/UPS" },
      ],
    },

    // Manager Info
    {
      name: "manager",
      type: "text",
      required: true,
      label: "Manager Name",
    },
    {
      name: "contactNumber",
      type: "text",
      required: true,
      label: "Contact Number",
      admin: {
        placeholder: "+92-300-1234567",
      },
    },

    // Tenants (optional - can be added later)
    {
      name: "tenants",
      type: "array",
      label: "Current Tenants",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "roomNumber",
          type: "text",
          required: true,
        },
        {
          name: "startDate",
          type: "date",
          required: true,
        },
        {
          name: "endDate",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  hooks: {
    // Auto-calculate available beds before saving
    beforeChange: [
      ({ data }: { data: any }) => {
        if (data.totalBeds && data.occupiedBeds !== undefined) {
          data.availableBeds = data.totalBeds - data.occupiedBeds;
        }
        return data;
      },
    ],
  },
  timestamps: true, // Adds createdAt and updatedAt automatically
};
