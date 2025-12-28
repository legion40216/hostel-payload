"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinksProps {
  routeActive?: boolean;
  routeHref: string;
  routeLabel?: string;
  children?: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  newTab?: boolean;
}

export default function NavLinks({
  routeActive,
  routeHref,
  routeLabel,
  children,
  className,
  activeClassName = "",
  inactiveClassName = "",
  newTab = false,
}: NavLinksProps) {

  return (
    <Link
      href={routeHref}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn(
        routeActive ? activeClassName : inactiveClassName,
        "transition-colors",
        className
      )}
    >
      {/* ?? means if children is not provided, use routeLabel */}
      {children ?? routeLabel}
    </Link>
  );
}

