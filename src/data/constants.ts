export const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
] as const;

import { Wifi, Wind, Bath, UtensilsCrossed, Shirt, Car, ShieldCheck, Zap } from 'lucide-react';

export const FACILITY_MAP: Record<string, React.ElementType> = {
  "WiFi": Wifi,
  "AC": Wind,
  "Attached Bathroom": Bath,
  "Kitchen": UtensilsCrossed,
  "Laundry": Shirt,
  "Parking": Car,
  "24/7 Security": ShieldCheck,
  "Generator/UPS": Zap,
};

// Create a simple array of the names so your .map() still works easily
export const FACILITY_NAMES = Object.keys(FACILITY_MAP);