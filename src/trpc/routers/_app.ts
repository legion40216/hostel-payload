import { hostelsRouter } from '@/modules/hostels/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hostels: hostelsRouter,
});

export type AppRouter = typeof appRouter;
