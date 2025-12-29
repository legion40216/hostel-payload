"use client";
import React from "react";
import Image from "next/image";
import { MapPin, Phone, Calendar } from "lucide-react";
import { formatter } from "@/utils/formatters";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/types";

import dynamic from "next/dynamic";

// Dynamically import with no SSR
const HostelMap = dynamic(() => import("../components/hostel-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      Loading map...
    </div>
  ),
});

type OverviewData = Omit<Property, "tenants" | "createdAt">;

interface PropertyOverviewProps {
  property: OverviewData;
}

export default function PropertyOverview({ property }: PropertyOverviewProps) {
  const occupancyRate = Math.round(
    (property.occupiedBeds / property.totalBeds) * 100
  );

  // Get room type display label
  const roomTypeLabel = {
    male: "Male Only",
    female: "Female Only",
    mixed: "Mixed/Co-ed",
  }[property.roomType];

  // Transform property to match HostelMap's expected type
  const mapProperty = {
    id: property.id,
    name: property.name,
    address: property.address,
    description: property.description,
    thumbnail: property.thumbnail,
    images: property.images,
    totalRooms: property.totalRooms,
    totalBeds: property.totalBeds,
    occupiedBeds: property.occupiedBeds,
    availableBeds: property.availableBeds,
    bedsPerRoom: property.bedsPerRoom,
    roomType: property.roomType,
    rentPerBed: property.rentPerBed,
    facilities: property.facilities,
  };

  return (
    <div className="space-y-8">
      {/* HERO IMAGE */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={
            property.images[0] || property.thumbnail || "/placeholder-image.png"
          }
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_30%] gap-8">
        <div className="space-y-8">
          {/* TITLE & ADDRESS */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{property.name}</h1>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
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
            <Stat
              label="Available Beds"
              value={`${property.availableBeds} / ${property.totalBeds}`}
            />
            <Stat label="Room Type" value={roomTypeLabel} />
            <Stat label="Occupancy" value={`${occupancyRate}%`} />
          </div>

          {/* FACILITIES */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Facilities & Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {property.facilities.map((facility) => (
                <Badge
                  key={facility}
                  variant="secondary"
                  className="px-3 py-1.5"
                >
                  {facility}
                </Badge>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              About {property.name}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* ROOM DETAILS */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Room Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Total Rooms" value={property.totalRooms} />
              <DetailItem
                label="Beds Per Room"
                value={
                  property.bedsPerRoom === "single"
                    ? "1 Bed"
                    : property.bedsPerRoom === "double"
                      ? "2 Beds"
                      : "3+ Beds"
                }
              />
              <DetailItem label="Total Beds" value={property.totalBeds} />
              <DetailItem
                label="Security Deposit"
                value={formatter.format(property.securityDeposit)}
              />
            </div>
          </div>

          {/* FEES AND POLICIES */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Fees & Policies</h3>
            <Tabs defaultValue="fees" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fees">Required Fees</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>
              <TabsContent value="fees" className="space-y-3 mt-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Monthly Rent (per bed)
                    </span>
                    <span className="font-medium">
                      {formatter.format(property.rentPerBed)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Security Deposit
                    </span>
                    <span className="font-medium">
                      {formatter.format(property.securityDeposit)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total Initial Payment</span>
                    <span className="font-semibold text-primary">
                      {formatter.format(
                        property.rentPerBed + property.securityDeposit
                      )}
                    </span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="policies" className="mt-4">
                <div className="border rounded-lg p-4 space-y-2 text-sm">
                  <p>• Minimum stay: 1 month</p>
                  <p>• Notice period: 1 month before vacating</p>
                  <p>• Visitors allowed with prior permission</p>
                  <p>• Quiet hours: 11 PM - 7 AM</p>
                  <p>• No smoking inside the premises</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* IMAGE GALLERY */}
          {property.images.length > 1 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Image Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.images.map((imgSrc, imgIndex) => (
                  <div
                    key={imgIndex}
                    className="relative aspect-square w-full overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={imgSrc || "/placeholder-image.png"}
                      alt={`${property.name} - Image ${imgIndex + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR - MANAGEMENT INFO */}
        <div className="space-y-6 ">
          {/* Contact Card */}
          <div className="border rounded-xl p-6 space-y-4  bg-white">
            {/* Manager Info */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Managed By</p>
              <p className="font-semibold">{property.manager}</p>
            </div>

            {/* Contact Section */}
            <div className="flex items-center gap-3 border p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary">
                <Phone className="size-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground">Contact Number</span>
                <a
                  href={`tel:${property.contactNumber}`}
                  className="font-medium hover:underline"
                >
                  {property.contactNumber}
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <Button className="w-full" size="lg">
              Submit Application
            </Button>

            {/* Metadata */}
            <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>
                  Last updated:{" "}
                  {new Date(property.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <span>Open by appointment: Monday-Friday</span>
            </div>
          </div>

          {/* Map - Shows only this property */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Location</p>
            {/* The wrapper handles the aspect ratio */}
            <div className="relative bg-muted rounded-lg overflow-hidden isolate aspect-square w-full border">
              <HostelMap
                properties={[mapProperty]}
                selectedProperty={mapProperty}
                onPropertySelect={(selectedProp) => {
                  console.log("Property clicked:", selectedProp);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-lg">{value}</span>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center border rounded-lg p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}