import React from 'react'
import { PropertySection } from '../section/property-section'

export default function PropertyView({propertyId}: {propertyId: string}) {
  return (
    <div>
        <PropertySection propertyId={propertyId}/>
    </div>
  )
}
