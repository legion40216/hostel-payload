import { bedsPerRoomOptions, roomTypeOptions, sortOptions } from "@/data/constants";

export type BedsPerRoom = typeof bedsPerRoomOptions[number];
export type RoomType = typeof roomTypeOptions[number];
export type SortOption = typeof sortOptions[number]['value'];

export type Facility = 
  | "WiFi" 
  | "AC" 
  | "Laundry" 
  | "Kitchen" 
  | "24/7 Security"
  | "Attached Bathroom"
  | "Parking"
  | "Generator/UPS";

export interface Area {
  value: string;
  label: string;
}

export type Areas = Area[];

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

export interface Tenant {
  name: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  postalCode: string | null; // or string | null | undefined
  location: Location;
}

export type Properties = Property[];