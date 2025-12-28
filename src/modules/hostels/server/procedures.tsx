import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { Where } from "payload";

export const hostelsRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
        area: z.string().optional(),
        roomType: z.enum(['male', 'female', 'mixed']).optional(),
        minRent: z.number().optional(),
        maxRent: z.number().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const andFilters: Where[] = [];

        // Filter by area
        if (input?.area) {
          andFilters.push({
            'address.area': {
              equals: input.area,
            },
          });
        }

        // Filter by room type
        if (input?.roomType) {
          andFilters.push({
            roomType: {
              equals: input.roomType,
            },
          });
        }

        // Filter by rent range
        if (input?.minRent || input?.maxRent) {
          // Using a record type instead of 'any' to satisfy ESLint
          const rentFilter: Record<string, number> = {}; 
          if (input.minRent) rentFilter.greater_than_equal = input.minRent;
          if (input.maxRent) rentFilter.less_than_equal = input.maxRent;
          
          andFilters.push({
            rentPerBed: rentFilter
          });
        }

        // Construct final where clause
        const finalWhere: Where = andFilters.length > 0 ? { and: andFilters } : {};

        const result = await ctx.payload.find({
          collection: "hostels",
          where: finalWhere,
          limit: input?.limit || 10,
          page: input?.page || 1,
          sort: '-createdAt',
        });

        return {
          hostels: result.docs,
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
          page: result.page,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        };
      } catch (error) {
        console.error("Error [getAll]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch hostels",
        });
      }
    }),

  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const hostel = await ctx.payload.findByID({
          collection: "hostels",
          id: input.id,
        });

        if (!hostel) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Hostel not found",
          });
        }

        return { hostel };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error [getById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch hostel",
        });
      }
    }),

  getAvailable: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        page: z.number().min(1).default(1),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.payload.find({
          collection: "hostels",
          where: {
            availableBeds: {
              greater_than: 0,
            },
          },
          limit: input?.limit || 10,
          page: input?.page || 1,
          sort: '-createdAt',
        });

        return {
          hostels: result.docs,
          totalDocs: result.totalDocs,
          totalPages: result.totalPages,
        };
      } catch (error) {
        console.error("Error [getAvailable]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch available hostels",
        });
      }
    }),
});