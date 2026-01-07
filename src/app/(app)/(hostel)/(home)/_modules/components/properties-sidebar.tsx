import React from "react";
import PropertyCard from "./properites-card";
import { Property } from "@/types/types";

// This type now perfectly matches what PropertyCard actually uses
type PropertySidebarData = Pick<
  Property,
  | "id"
  | "name"
  | "thumbnail"
  | "address"
  | "availableBeds"
  | "totalBeds"
  | "rentPerBed"
  | "facilities"
>;

interface PropertiesSidebarProps {
  viewMode: "grid" | "list";
  sortedProperties: PropertySidebarData[]; // Use the filtered/sorted lean list
}

export default function PropertiesSidebar({
  viewMode,
  sortedProperties,
}: PropertiesSidebarProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        {sortedProperties.length}{" "}
        {sortedProperties.length === 1 ? "property" : "properties"} found
      </div>

      <div className={`grid gap-4 ${ viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
          } 
            max-h-150 overflow-y-auto`
          }
      >
        {sortedProperties.map((item) => (
          <PropertyCard
            key={item.id}
            id={item.id}
            name={item.name}
            thumbnail={item.thumbnail}
            address={item.address}
            availableBeds={item.availableBeds}
            rentPerBed={item.rentPerBed}
            totalBeds={item.totalBeds}
            facilities={item.facilities}
          />
        ))}
      </div>
    </div>
  );
}
