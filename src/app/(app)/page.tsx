import React from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import HomepageView from "./_modules/views/homepage-view";

export default async function Page() { 
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.hostels.getAll.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomepageView />
    </HydrationBoundary>
  );
}
