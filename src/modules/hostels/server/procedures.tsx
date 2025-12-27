import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
        const where: any = {};

        // Filter by area
        if (input?.area) {
          where['address.area'] = {
            equals: input.area,
          };
        }

        // Filter by room type
        if (input?.roomType) {
          where.roomType = {
            equals: input.roomType,
          };
        }

        // Filter by rent range
        if (input?.minRent || input?.maxRent) {
          where.rentPerBed = {};
          if (input.minRent) {
            where.rentPerBed.greater_than_equal = input.minRent;
          }
          if (input.maxRent) {
            where.rentPerBed.less_than_equal = input.maxRent;
          }
        }

        const result = await ctx.payload.find({
          collection: "hostels",
          where: Object.keys(where).length > 0 ? where : undefined,
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
          cause: error,
        });
      }
    }),

  getById: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
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
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error [getById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch hostel",
          cause: error,
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
          cause: error,
        });
      }
    }),

  // Search hostels
  search: baseProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.payload.find({
          collection: "hostels",
          where: {
            or: [
              {
                name: {
                  contains: input.query,
                },
              },
              {
                description: {
                  contains: input.query,
                },
              },
              {
                'address.area': {
                  contains: input.query,
                },
              },
            ],
          },
          limit: input.limit,
        });

        return {
          hostels: result.docs,
          totalDocs: result.totalDocs,
        };
      } catch (error) {
        console.error("Error [search]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search hostels",
          cause: error,
        });
      }
    }),
});