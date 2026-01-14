// schema.ts
import { z } from "zod";
import { sortOptions, bedsPerRoomOptions, roomTypeOptions } from "@/data/constants";

export const searchParamsSchema = z.object({
  // Sort
  sort: z
    .enum(sortOptions.map(option => option.value) as [string, ...string[]])
    .optional()
    .catch("newest")
    .default("newest"),
  
  // Price Range
  minPrice: z.coerce.number().min(3000).max(20000).optional().default(3000),
  maxPrice: z.coerce.number().min(3000).max(20000).optional().default(20000),
  
  // Room Type
  roomType: z.enum(["all", ...roomTypeOptions]).optional().default("all"),
  
  // Area
  area: z.string().optional().default("all"),
  
  // Beds Per Room
  bedsPerRoom: z.enum(["all", ...bedsPerRoomOptions]).optional().default("all"),
  
  // Facilities
  facilities: z.string().optional().default(""),
});

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;