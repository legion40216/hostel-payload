import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { formatter } from '@/utils/formatters'
import { Facility, RoomType, BedsPerRoom, Areas } from '@/types/types'
import { FACILITY_MAP } from '@/data/constants'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group'

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet'

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface FilterState {
  priceRange: [number, number]
  facilities: Facility[]
  roomType: RoomType | "all"
  area: string
  bedsPerRoom: BedsPerRoom | "all"
}

interface FilterSheetProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onApply: () => void
  areas: Areas
}

export default function FilterSheet({ 
  filters, 
  setFilters, 
  onApply,
  areas 
}: FilterSheetProps) {
  const router = useRouter()

  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [isOpen, setIsOpen] = useState(false)

  const handleFacilityToggle = (facility: Facility) => {
    setLocalFilters(prev => {
      const newFacilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
      
      return {
        ...prev,
        facilities: newFacilities
      }
    })
  }

  const handleClearAll = () => {
    const cleared: FilterState = {
      priceRange: [3000, 20000],
      facilities: [],
      roomType: "all",
      area: "all",
      bedsPerRoom: "all"
    }
    
    setLocalFilters(cleared)
    setFilters(cleared)
    
    // Clear URL query params
    router.push(window.location.pathname, { scroll: false })
    
    // Close the sheet
    setIsOpen(false)
  }

  const handleApply = () => {
    setFilters(localFilters)
    onApply()
    setIsOpen(false)
  }

  const activeFiltersCount = (() => {
    const countFilters = (f: FilterState) =>
      f.facilities.length +
      (f.roomType !== "all" ? 1 : 0) +
      (f.area !== "all" ? 1 : 0) +
      (f.bedsPerRoom !== "all" ? 1 : 0) +
      (f.priceRange[0] !== 3000 || f.priceRange[1] !== 20000 ? 1 : 0)

    return isOpen ? countFilters(localFilters) : countFilters(filters)
  })()

  return (
      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            setLocalFilters(filters);
          }
        }}
      >
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 size-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="p-3 [&>button]:hidden overflow-y-auto"
      >
        <SheetTitle className="sr-only">Filter Properties</SheetTitle>
        <SheetDescription className="sr-only">
          Filter hostels by price, facilities, and location
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Price Range (PKR/month)
            </Label>
            <div className="pt-2">
              <Slider
                min={3000}
                max={20000}
                step={500}
                value={localFilters.priceRange}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatter.format(localFilters.priceRange[0])}</span>
                <span>{formatter.format(localFilters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Room Type</Label>
            <RadioGroup
              value={localFilters.roomType}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  roomType: value as RoomType | "all",
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  All
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Male Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Female Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="font-normal cursor-pointer">
                  Mixed/Co-ed
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Location</Label>
            <Select
              value={localFilters.area}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  area: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Beds per Room */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Beds per Room</Label>
            <RadioGroup
              value={localFilters.bedsPerRoom}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  bedsPerRoom: value as BedsPerRoom | "all",
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="beds-all" />
                <Label
                  htmlFor="beds-all"
                  className="font-normal cursor-pointer"
                >
                  Any
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="font-normal cursor-pointer">
                  Single (1 bed)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="double" id="double" />
                <Label htmlFor="double" className="font-normal cursor-pointer">
                  Shared (2 beds)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="triple" id="triple" />
                <Label htmlFor="triple" className="font-normal cursor-pointer">
                  Shared (3+ beds)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Facilities */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Facilities</Label>
            <div className="space-y-2">
              {Object.entries(FACILITY_MAP).map(([name]) => (
                <div key={name} className="flex items-center space-x-3">
                  <Checkbox
                    id={name}
                    checked={localFilters.facilities.includes(name as Facility)}
                    onCheckedChange={() =>
                      handleFacilityToggle(name as Facility)
                    }
                  />
                  <Label
                    htmlFor={name}
                    className="flex items-center gap-2 font-normal cursor-pointer"
                  >
                    {name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 pt-6 mt-6 border-t bg-background">
          <Button variant="outline" className="flex-1" onClick={handleClearAll}>
            Clear All
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}