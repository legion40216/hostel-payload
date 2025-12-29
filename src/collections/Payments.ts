import type { CollectionConfig } from "payload";

export const Payments: CollectionConfig = {
  slug: "payments",
  admin: {
    useAsTitle: "paymentId",
    defaultColumns: ["tenant", "hostel", "amount", "paymentDate", "status", "paymentMethod"],
    group: "Financial",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Auto-generated Payment ID
    {
      name: "paymentId",
      type: "text",
      required: true,
      unique: true,
      label: "Payment ID",
      admin: {
        readOnly: true,
        description: "Auto-generated on creation",
      },
    },

    // Relationships
    {
      name: "tenant",
      type: "relationship",
      relationTo: "tenants",
      required: true,
      label: "Tenant",
    },
    {
      name: "hostel",
      type: "relationship",
      relationTo: "hostels",
      required: true,
      label: "Hostel",
    },

    // Payment Details
    {
      name: "amount",
      type: "number",
      required: true,
      min: 0,
      label: "Amount (PKR)",
    },
    {
      name: "paymentType",
      type: "select",
      required: true,
      label: "Payment Type",
      options: [
        { label: "Monthly Rent", value: "rent" },
        { label: "Security Deposit", value: "deposit" },
        { label: "Late Fee", value: "late_fee" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Utility Bill", value: "utility" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "forMonth",
      type: "date",
      label: "For Month",
      admin: {
        date: {
          pickerAppearance: "monthOnly",
        },
        description: "Which month is this payment for? (For rent payments)",
        condition: (data) => data.paymentType === "rent",
      },
    },

    // Payment Status
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      label: "Payment Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
        { label: "Partial", value: "partial" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    {
      name: "dueDate",
      type: "date",
      required: true,
      label: "Due Date",
    },
    {
      name: "paymentDate",
      type: "date",
      label: "Payment Date",
      admin: {
        description: "Actual date when payment was received",
        condition: (data) => data.status === "paid" || data.status === "partial",
      },
    },

    // Payment Method
    {
      name: "paymentMethod",
      type: "select",
      label: "Payment Method",
      options: [
        { label: "Cash", value: "cash" },
        { label: "Bank Transfer", value: "bank_transfer" },
        { label: "JazzCash", value: "jazzcash" },
        { label: "EasyPaisa", value: "easypaisa" },
        { label: "Cheque", value: "cheque" },
        { label: "Online Payment", value: "online" },
      ],
      admin: {
        condition: (data) => data.status === "paid" || data.status === "partial",
      },
    },
    {
      name: "transactionReference",
      type: "text",
      label: "Transaction Reference",
      admin: {
        placeholder: "e.g., Cheque number, Transaction ID",
        condition: (data) => data.status === "paid" || data.status === "partial",
      },
    },

    // Receipts & Documents
    {
      name: "receiptNumber",
      type: "text",
      label: "Receipt Number",
      admin: {
        condition: (data) => data.status === "paid" || data.status === "partial",
      },
    },
    {
      name: "receiptDocument",
      type: "upload",
      relationTo: "media",
      label: "Receipt/Proof",
      admin: {
        description: "Upload receipt or payment proof",
      },
    },

    // Additional Info
    {
      name: "lateFee",
      type: "number",
      min: 0,
      defaultValue: 0,
      label: "Late Fee (PKR)",
      admin: {
        condition: (data) => data.status === "overdue" || data.status === "paid",
      },
    },
    {
      name: "discount",
      type: "number",
      min: 0,
      defaultValue: 0,
      label: "Discount (PKR)",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Notes",
      admin: {
        placeholder: "Any additional information about this payment",
      },
    },

    // Collected By
    {
      name: "collectedBy",
      type: "text",
      label: "Collected By",
      admin: {
        placeholder: "Name of person who collected payment",
        condition: (data) => data.status === "paid" || data.status === "partial",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate Payment ID on creation
        if (operation === "create" && !data.paymentId) {
          const timestamp = Date.now();
          const random = Math.floor(Math.random() * 1000);
          data.paymentId = `PAY-${timestamp}-${random}`;
        }

        // Auto-update status to overdue if past due date and not paid
        if (data.status === "pending" && data.dueDate) {
          const dueDate = new Date(data.dueDate);
          const today = new Date();
          if (today > dueDate) {
            data.status = "overdue";
          }
        }

        return data;
      },
    ],
  },
  timestamps: true,
};