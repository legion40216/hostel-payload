"use client";
import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface GalleryModalProps {
  images: string[];
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function GalleryModal({
  images,
  propertyName,
  isOpen,
  onClose,
  initialIndex = 0,
}: GalleryModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  // Update selected index when initialIndex changes
  React.useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  if (!images.length) return null;

  const selectedImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none [&>button]:hidden">
        <div className="w-full">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4 px-4">
            <div className="text-white">
              <p className="text-sm text-gray-300">
                {selectedIndex + 1} / {images.length}
              </p>
              <h3 className="font-semibold">{propertyName}</h3>
            </div>
            <Button
              onClick={onClose}
              aria-label="Close gallery"
              size="icon"
              variant="secondary"
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Main Image */}
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
            <Image
              src={selectedImage}
              alt={`${propertyName} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              priority
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
                  aria-label="Previous image"
                  size="icon"
                  variant="secondary"
                >
                  <ChevronLeft className="size-5" />
                </Button>

                <Button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
                  aria-label="Next image"
                  size="icon"
                  variant="secondary"
                >
                  <ChevronRight className="size-5" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto p-1">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    relative aspect-square w-24 shrink-0 rounded-md overflow-hidden
                    border-2 transition-all hover:border-white
                    focus-visible:outline-none focus-visible:ring-2 
                    focus-visible:ring-ring focus-visible:ring-offset-2
                    ${index === selectedIndex ? 'border-transparent ring-2 ring-white hover:border-transparent!' : 'border-gray-600'}
                  `}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}