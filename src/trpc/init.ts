import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import { getPayload } from 'payload';
import config from '@payload-config';

export const createTRPCContext = cache(async () => {
  const payload = await getPayload({ config });
  return { payload };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure;
