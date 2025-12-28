import React from 'react'
import { formatter } from '@/utils/formatters'
import { Bed, Wifi, Car, Shield, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types/types'

import { Badge } from '@/components/ui/badge'

type PropertyCardProps = Pick<
  Property, 
  'id' | 'name' | 'thumbnail' | 'address' | 'availableBeds' | 'rentPerBed' | 'totalBeds' | 'facilities'
>

export default function PropertyCard({ 
  id,
  name,
  thumbnail,
  address,
  availableBeds,
  rentPerBed,
  totalBeds,
  facilities
}: PropertyCardProps) {
  const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'WiFi': Wifi,
    'Parking': Car,
    '24/7 Security': Shield
  }
  
  const displayFacilities = facilities.slice(0, 2)
  
  return (
    <Link href={`/properties/${id}`} className="block">
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow 
      bg-white"
      >
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={thumbnail}
            alt={name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
            <Badge>
              {availableBeds} Beds Available
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground flex items-start gap-1">
              <MapPin className="size-3 mt-0.5 shrink-0" />
              {address.street}, {address.area}
            </p>
          </div>
          
          <div>
            <span className="font-semibold text-lg text-primary">
              {formatter.format(rentPerBed)} / month
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Bed className="size-4" />
              <span>{totalBeds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              {displayFacilities.map((facility, idx) => {
                const Icon = facilityIcons[facility]
                return Icon ? <Icon key={idx} className="size-4" /> : null
              })}
              <span className="text-xs">
                {displayFacilities.join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}