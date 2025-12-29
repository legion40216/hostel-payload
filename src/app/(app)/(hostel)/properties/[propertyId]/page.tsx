import React from 'react'
import PropertyView from './view/property-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function Page({params}: {params: Promise<{propertyId: string}>}) {
  const {propertyId} = await params;
  
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.hostels.getById.queryOptions({ id: propertyId }));
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyView propertyId={propertyId}/>
    </HydrationBoundary>
  );
}
