import React from "react";

import { formatter } from "@/utils/formatters";
import { Bed, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/types";

import { Badge } from "@/components/ui/badge";
import { FACILITY_MAP } from "@/data/constants";

type PropertyCardProps = Pick<
  Property,
  | "id"
  | "name"
  | "thumbnail"
  | "address"
  | "availableBeds"
  | "rentPerBed"
  | "totalBeds"
  | "facilities"
>;

export default function PropertyCard({
  id,
  name,
  thumbnail,
  address,
  availableBeds,
  rentPerBed,
  totalBeds,
  facilities,
}: PropertyCardProps) {
  // Get the first 2 facilities to keep the card clean
  const displayFacilities = facilities.slice(0, 3);

  return (
    <Link href={`/properties/${id}`} className="block">
      <div
        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow 
      bg-white"
      >
        <div className="relative aspect-video bg-gray-100">
          <Image src={thumbnail} alt={name} fill className="object-cover" />

          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
            <Badge>{availableBeds} Beds Available</Badge>
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

          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Bed className="size-4" />
              <span>{totalBeds} Beds</span>
            </div>

            {/* Render Facilities with Icons */}
            <div className="flex items-center gap-2">
              {/* Icons Container */}
              <div className="flex -space-x-1.5">
                {displayFacilities.map((f) => {
                  const Icon = FACILITY_MAP[f];
                  return Icon ? (
                    <div key={f}>
                      <Icon
                        key={f}
                        className="size-4 border-white bg-white rounded-full"
                      />
                    </div>
                  ) : null;
                })}
              </div>

              {/* Label with Count */}
              <span className="text-xs text-muted-foreground">
                {facilities.length > 2 ? (
                  <>
                    {displayFacilities[0]} &{" "}
                    <strong className="text-primary">
                      {facilities.length - 1} more
                    </strong>
                  </>
                ) : (
                  displayFacilities.join(", ")
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
