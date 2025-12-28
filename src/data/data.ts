import { Facility, Properties } from "@/types/types";

export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
] as const;


export const FACILITIES: Facility[] = [
  "WiFi",
  "AC", 
  "Attached Bathroom",
  "Kitchen",
  "Laundry",
  "Parking",
  "24/7 Security",
  "Generator/UPS"
]

// Define areas based on your actual data
export const AREAS: { value: string; label: string }[] = [
  { value: "all", label: "All Areas" },
  { value: "Saddar", label: "Saddar" },
  { value: "Latifabad", label: "Latifabad" },
  { value: "Qasimabad", label: "Qasimabad" },
  { value: "Near University", label: "Near University" },
  { value: "Cantonment", label: "Cantonment" }
]

export const properties: Properties = [
  {
    id: 1,
    name: "Sunrise Hostel",
    address: {
      street: "123 University Road",
      area: "Saddar",
      city: "Hyderabad",
      postalCode: "71000",
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
  {
    id: 2,
    name: "Green Valley Hostel",
    address: {
      street: "456 College Street",
      area: "Latifabad",
      city: "Hyderabad",
      postalCode: "71001",
    },
    description:
      "Spacious and affordable accommodation with excellent facilities for students.",
    thumbnail:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
    ],

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

    totalRooms: 20,
    totalBeds: 60,
    occupiedBeds: 45,
    availableBeds: 15,
    bedsPerRoom: "triple",
    roomType: "female",

    rentPerBed: 6500,
    securityDeposit: 12000,
    facilities: ["WiFi", "Attached Bathroom", "Parking", "Generator/UPS"],

    manager: "Fatima Ali",
    contactNumber: "+92-300-2345678",

    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-12-10T14:30:00Z",
  },
  {
    id: 5,
    name: "Cantonment Lodge",
    address: {
      street: "555 Defense Avenue",
      area: "Cantonment",
      city: "Hyderabad",
      postalCode: "71004",
    },
    description: "Secure and comfortable hostel in cantonment area.",
    thumbnail:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
    ],

    tenants: [],

    totalRooms: 12,
    totalBeds: 36,
    occupiedBeds: 30,
    availableBeds: 6,
    bedsPerRoom: "double",
    roomType: "female",

    rentPerBed: 9000,
    securityDeposit: 16000,
    facilities: [
      "WiFi",
      "AC",
      "Attached Bathroom",
      "24/7 Security",
      "Generator/UPS",
    ],

    manager: "Ayesha Siddiqui",
    contactNumber: "+92-300-5678901",

    createdAt: "2024-08-10T10:00:00Z",
    updatedAt: "2024-12-22T14:30:00Z",
  },
];
