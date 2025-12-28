import React from 'react';

import { SearchParamsValues } from '@/schemas';
import { MainSection } from '../sections/main-section';

export default function HomepageView({ 
  searchParams 
}: { 
  searchParams: SearchParamsValues 
}) {
  return (
    <div>
      <MainSection searchParams={searchParams} />
    </div>
  );
}