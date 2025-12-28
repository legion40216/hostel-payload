import React from "react";
import PropertyCard from "./properites-card";
import { Property } from "@/types/types";

interface PropertiesSidebarProps {
  properties: Property[];
  viewMode: "grid" | "list";
  sortedProperties: Property[];
}

export default function PropertiesSidebar({
  properties,
  viewMode,
  sortedProperties
}: PropertiesSidebarProps) {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        {sortedProperties.length}{" "}
        {sortedProperties.length === 1 ? "property" : "properties"} found
      </div>

      <div className={`grid gap-4 ${ viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
          } 
            max-h-150 overflow-y-auto`
          }
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            name={property.name}
            thumbnail={property.thumbnail}
            address={property.address}
            availableBeds={property.availableBeds}
            rentPerBed={property.rentPerBed}
            totalBeds={property.totalBeds}
            facilities={property.facilities}
          />
        ))}
      </div>
    </div>
  );
}
