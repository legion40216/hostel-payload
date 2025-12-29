import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "cnic", "contactNumber", "status"],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Personal Info
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "cnic",
      type: "text",
      required: true,
      unique: true,
      label: "CNIC Number",
      admin: {
        placeholder: "12345-1234567-1",
      },
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
    {
      name: "email",
      type: "email",
      label: "Email Address",
    },
        {
      name: "hostel",
      type: "relationship",
      relationTo: "hostels",
      required: true,
      label: "Assigned Hostel",
    },
    {
      name: "emergencyContact",
      type: "group",
      label: "Emergency Contact",
      fields: [
        {
          name: "name",
          type: "text",
          label: "Contact Name",
        },
        {
          name: "relationship",
          type: "text",
          label: "Relationship",
          admin: {
            placeholder: "e.g., Father, Mother, Sibling",
          },
        },
        {
          name: "phone",
          type: "text",
          label: "Phone Number",
        },
      ],
    },

    // Occupation
    {
      name: "occupation",
      type: "select",
      required: true,
      label: "Occupation",
      options: [
        { label: "Student", value: "student" },
        { label: "Working Professional", value: "working" },
        { label: "Business", value: "business" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "occupationDetails",
      type: "textarea",
      label: "Occupation Details",
      admin: {
        placeholder: "Institution/Company name, designation, etc.",
      },
    },

    // Status
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },

    // Documents
    {
      name: "cnicPhoto",
      type: "upload",
      relationTo: "media",
      label: "CNIC Photo",
    },
    {
      name: "profilePhoto",
      type: "upload",
      relationTo: "media",
      label: "Profile Photo",
    },

    // Additional Info
    {
      name: "notes",
      type: "textarea",
      label: "Notes",
      admin: {
        placeholder: "Any additional information about the tenant",
      },
    },
  ],
  timestamps: true,
};