import type { CollectionConfig } from "payload";
// Import the specific types needed for access and hooks
import type { Access, CollectionBeforeChangeHook } from "payload";

export const Hostels: CollectionConfig = {
  slug: "hostels",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "area", "rentPerBed", "availableBeds", "roomType"],
  },
  access: {
    read: () => true,
    // Use the 'Access' type or rely on Payload's internal inference
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
          type: "text", // changed from select
          required: true,
        },
        {
          name: "city",
          type: "text", // remove defaultValue
          required: true,
        },
        {
          name: "postalCode",
          type: "text",
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
    beforeChange: [
      ({ data }) => {
        // You can safely cast or check properties here
        if (
          typeof data.totalBeds === "number" &&
          typeof data.occupiedBeds === "number"
        ) {
          data.availableBeds = data.totalBeds - data.occupiedBeds;
        }
        return data;
      },
    ],
  },
  timestamps: true,
};
