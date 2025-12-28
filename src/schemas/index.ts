import { z } from "zod";
import { sortOptions } from "@/data/constants";


export type SortOption = typeof sortOptions[number]['value'];

// Comprehensive search params schema with all filters
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
  roomType: z.enum(["all", "male", "female", "mixed"]).optional().default("all"),
  
  // Area
  area: z.string().optional().default("all"),
  
  // Beds Per Room
  bedsPerRoom: z.enum(["all", "single", "double", "triple"]).optional().default("all"),
  
  // Facilities (comma-separated string)
  facilities: z.string().optional().default(""),
});

export type SearchParamsValues = z.infer<typeof searchParamsSchema>;