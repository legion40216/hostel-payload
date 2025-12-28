import { Properties } from "@/types/types";

export const AREAS: { value: string; label: string }[] = [
  { value: "all", label: "All Areas" },
  { value: "Saddar", label: "Saddar" },
  { value: "Latifabad", label: "Latifabad" },
  { value: "Qasimabad", label: "Qasimabad" },
  { value: "Near University", label: "Near University" },
  { value: "Cantonment", label: "Cantonment" }
]


// Note: AREAS is now removed - areas are dynamic from the database

export const properties: Properties = [
  {
    id: 1,
    name: "Sunrise Hostel",
    address: {
      street: "123 University Road",
      area: "Saddar",
      city: "Hyderabad",
      postalCode: "71000",
      location: {
        latitude: 25.3960,
        longitude: 68.3578,
      },
    },
    description:
      "Modern hostel near university with all amenities. Perfect for students and young professionals.",
    thumbnail:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
    images: ["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"],

    totalRooms: 15,
    totalBeds: 45,
    occupiedBeds: 38,
    availableBeds: 7,
    bedsPerRoom: "double",
    roomType: "male",

    rentPerBed: 8000,
    securityDeposit: 15000,
    facilities: ["WiFi", "AC", "Laundry", "Kitchen", "24/7 Security"],

    tenants: [
      {
        name: "John Doe",
        roomNumber: "101",
        startDate: "2023-08-01",
        endDate: "2023-08-15",
      },
      {
        name: "Jane Smith",
        roomNumber: "102",
        startDate: "2023-08-01",
        endDate: "2023-08-15",
      },
    ],

    manager: "Ahmed Khan",
    contactNumber: "+92-300-1234567",

    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
  },
  // Add more properties with location data...
];