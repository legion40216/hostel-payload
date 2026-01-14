"use client";
import React from "react";
import { Grid, List } from "lucide-react";

import { FilterState } from "@/utils/filterHelpers";
import { Areas, SortOption } from "@/types/types";
import { sortOptions } from "@/data/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import FilterSheet from "./filter-sheet";

interface FilterBarProps {
  filters: FilterState;
  sortBy: SortOption;
  viewMode: "grid" | "list";
  onFilterChange: (newFilters: FilterState) => void;
  onSortChange: (value: SortOption) => void;
  onViewChange: (mode: "grid" | "list") => void;
  areas: Areas;
}

export default function FilterBar({
  filters,
  sortBy,
  viewMode,
  onFilterChange,
  onSortChange,
  onViewChange,
  areas,
}: FilterBarProps) {
  return (
<div className="flex items-center justify-between gap-2">
  {/* LEFT GROUP */}
  <div className="flex items-center gap-x-2 flex-1">
    <FilterSheet
      filters={filters}
      setFilters={onFilterChange}
      onApply={() => {}}
      areas={areas}
    />

    <div className="flex-1 max-w-50">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* RIGHT GROUP */}
  <ButtonGroup aria-label="View mode" className="h-fit hidden md:block">
    <Button
      variant={viewMode === "grid" ? "default" : "outline"}
      size="icon"
      onClick={() => onViewChange("grid")}
    >
      <Grid className="size-4" />
    </Button>
    <Button
      variant={viewMode === "list" ? "default" : "outline"}
      size="icon"
      onClick={() => onViewChange("list")}
    >
      <List className="size-4" />
    </Button>
  </ButtonGroup>
</div>

  );
}