'use client';

import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export const MainSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <div>Error loading main section. Please try again later.</div>
        }>
        <MainSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};



const MainSectionContent = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.hostels.getAll.queryOptions()
  );

  console.log(data);

  return <div>Main Section Content</div>;
};
