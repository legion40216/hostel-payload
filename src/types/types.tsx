export type BedsPerRoom = "single" | "double" | "triple";

export type RoomType = "male" | "female" | "mixed";

export interface Tenant {
  name: string;
  roomNumber: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

export interface Address {
  street: string;
  area: string;
  city: string;
  postalCode: string;
}

export type Facility = 
  | "WiFi" 
  | "AC" 
  | "Laundry" 
  | "Kitchen" 
  | "24/7 Security"
  | "Attached Bathroom"
  | "Parking"
  | "Generator/UPS";

export interface Property {
  id: number;
  name: string;

  address: Address;
  description: string;

  thumbnail: string;
  images: string[];

  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;

  bedsPerRoom: BedsPerRoom;
  roomType: RoomType;

  rentPerBed: number;
  securityDeposit: number;

  facilities: Facility[];

  tenants: Tenant[];

  manager: string;
  contactNumber: string;

  createdAt: string;
  updatedAt: string;
}

export type Properties = Property[];

