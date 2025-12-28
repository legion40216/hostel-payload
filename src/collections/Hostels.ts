import type { CollectionConfig } from "payload";

export const Hostels: CollectionConfig = {
  slug: "hostels",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "address.area", "rentPerBed", "availableBeds", "roomType"],
  },
  access: {
    read: () => true,
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

    // Address Group with Geolocation
    {
      name: "address",
      type: "group",
      fields: [
        {
          name: "street",
          type: "text",
          required: true,
          label: "Street Address",
        },
        {
          name: "area",
          type: "text", // Free text input - not predefined
          required: true,
          label: "Area/Neighborhood",
          admin: {
            placeholder: "e.g., Saddar, Latifabad, Qasimabad",
          },
        },
        {
          name: "city",
          type: "text",
          required: true,
          label: "City",
          admin: {
            placeholder: "e.g., Hyderabad",
          },
        },
        {
          name: "postalCode",
          type: "text",
          label: "Postal Code",
          admin: {
            placeholder: "e.g., 71000",
          },
        },
        // Geolocation for Leaflet
        {
          name: "location",
          type: "group",
          label: "Map Location",
          fields: [
            {
              name: "latitude",
              type: "number",
              required: true,
              label: "Latitude",
              admin: {
                placeholder: "25.3960",
                description: "Click on map or enter manually",
                step: 0.000001,
              },
            },
            {
              name: "longitude",
              type: "number",
              required: true,
              label: "Longitude",
              admin: {
                placeholder: "68.3578",
                description: "Click on map or enter manually",
                step: 0.000001,
              },
            },
          ],
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
      label: "Total Rooms",
    },
    {
      name: "totalBeds",
      type: "number",
      required: true,
      min: 1,
      label: "Total Beds",
    },
    {
      name: "occupiedBeds",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
      label: "Occupied Beds",
    },
    {
      name: "availableBeds",
      type: "number",
      required: true,
      min: 0,
      label: "Available Beds",
      admin: {
        readOnly: true,
        description: "Auto-calculated: totalBeds - occupiedBeds",
      },
    },
    {
      name: "bedsPerRoom",
      type: "select",
      required: true,
      label: "Beds Per Room",
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
      label: "Room Type",
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
      required: false,
      label: "Facilities",
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

    // Tenants
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
        // Auto-calculate available beds
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