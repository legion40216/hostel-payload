"use client";
import React from "react";
import Image from "next/image";
import { properties } from "@/data/data";
import { MapPin, Phone, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatter } from "@/utils/formatters";
import { Property } from "@/types/types";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PropertyOverview({
  propertyId,
}: {
  propertyId: string;
}) {

  const property: Property | undefined = properties.find((p) => p.id.toString() === propertyId);

  if (!property) {
    return <p className="text-muted-foreground">Property not found.</p>;
  }

  const occupancyRate = Math.round(
    (property.occupiedBeds / property.totalBeds) * 100
  );

  return (
    <div className="space-y-8">
      {/* HERO IMAGE */}
      <div className="relative aspect-video h-[60vh] w-full overflow-hidden rounded-xl">
        <Image
          src={property.images[0] || "/placeholder-image.png"}
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-[1fr_30%] gap-8">
        <div>
          <div className="space-y-8">
            {/* TITLE & ADDRESS */}
            <div className="space-y-4">
              {/* HEADER */}
              <h1 className="text-2xl font-bold">{property.name}</h1>

              {/* ADDRESS */}
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="size-4" />
                  <span>
                    {property.address.street}, {property.address.area},{" "}
                    {property.address.city}
                  </span>
                </p>
                <span className="text-sm text-green-600 font-medium">
                  ✔ Verified Listing
                </span>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border rounded-xl p-4">
              <Stat
                label="Rent / Bed"
                value={formatter.format(property.rentPerBed)}
              />
              <Stat label="Available Beds" value={property.availableBeds} />
              <Stat label="Room Type" value={property.roomType} />
              <Stat label="Occupancy" value={`${occupancyRate}%`} />
            </div>

            {/* FACILITIES */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {property.facilities.map((facility) => (
                  <Badge key={facility} className="px-3 py-1">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="font-semibold text-lg mb-1">
                About {property.name}
              </h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>

            {/*HIGHLIGHTS */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Highlights</h3>
              <div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Located near major universities and colleges.</li>
                  <li>24/7 security and surveillance for safety.</li>
                  <li>Well-equipped kitchens and bathrooms.</li>
                </ul>
              </div>
            </div>

            {/* FEES AND POLICIES */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Fees and Policies</h3>
              <Tabs defaultValue="account">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Required Fees</TabsTrigger>
                  <TabsTrigger value="password">Parking</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  Make changes to your account here.
                </TabsContent>
                <TabsContent value="password">
                  Change your password here.
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* IMAGE GALLERY */}
          <div className="mt-25">
            <h3 className="font-semibold text-lg mb-2">Image Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {properties.map((items) =>
                items.images.map((imgSrc, imgIndex) => (
                  <div
                    key={`${items.id}-${imgIndex}`}
                    className="relative aspect-square w-full overflow-hidden rounded-xl"
                  >
                    <Image
                      src={imgSrc || "/placeholder-image.png"}
                      alt={items.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MANAGEMENT INFO */}
        <div className="space-y-6">
          <div className="border rounded-xl p-4 space-y-4">
            {/* 📞 Contact Section */}
            <div className="flex items-center gap-3 border p-4 rounded-md">
              <div
                className="flex items-center justify-center h-10 w-10 rounded-full
              bg-primary text-primary"
              >
                <Phone className="size-5 text-secondary" />
              </div>

              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground">Contact Number</span>

                {/* 👉 Clickable phone number */}
                <a
                  href={`tel:${property.contactNumber}`}
                  className="font-medium hover:underline"
                >
                  {property.contactNumber}
                </a>
              </div>
            </div>

            {/* 🚀 CTA */}
            <Button className="w-full">Submit Application</Button>

            {/* 🕒 Metadata */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>
                Last updated on{" "}
                {new Date(property.updatedAt).toLocaleDateString()}
              </span>

              <span>
                Opened by appointment on <strong>Monday-Tuesday</strong>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm flex items-start flex-wrap gap-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-4 inline" />
                Location:
              </span>
              <strong className="wrap-break-word">
                {property.address.street}, {property.address.city}
              </strong>
            </p>


            <div className="bg-muted rounded-lg flex items-center justify-center aspect-square">
              <p className="text-muted-foreground">Map View Coming Soon</p>
            </div>
          </div>

          <div>
            <div className="aspect-square ml-auto h-25 bg-muted rounded-lg flex items-center justify-center">
              <p>QR CODE </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
