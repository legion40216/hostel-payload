import { Wifi, Wind, Bath, UtensilsCrossed, Shirt, Car, ShieldCheck, Zap } from 'lucide-react';

export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
] as const;

export const bedsPerRoomOptions = ["single", "double", "triple"] as const;
export const roomTypeOptions = ["male", "female", "mixed"] as const;

export const FACILITY_MAP = {
  "WiFi": Wifi,
  "AC": Wind,
  "Attached Bathroom": Bath,
  "Kitchen": UtensilsCrossed,
  "Laundry": Shirt,
  "Parking": Car,
  "24/7 Security": ShieldCheck,
  "Generator/UPS": Zap,
} as const;

export type FacilityName = keyof typeof FACILITY_MAP;
export const FACILITY_NAMES = Object.keys(FACILITY_MAP) as FacilityName[];