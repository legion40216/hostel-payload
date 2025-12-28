import React from 'react'
import PropertyOverview from './section/property-overview';

export default async function page({params}: {params: Promise<{propertyId: string}>}) {
  const resolvedParams = await params;
  
  return (
    <div>
      <PropertyOverview propertyId={resolvedParams.propertyId}/>
    </div>
  )
}