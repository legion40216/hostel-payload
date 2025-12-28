import { searchParamsSchema, SearchParamsValues } from "@/schemas";
import { ReadonlyURLSearchParams } from "next/navigation";

// Normalize Server Params (Next.js prop)
function normalizeServerSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      result[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key] = value[value.length - 1];
    }
  }
  return result;
}

// Normalize Client Params (Browser API)
function normalizeClientSearchParams(
  params: URLSearchParams | ReadonlyURLSearchParams
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

// Main Parser
export function getValidatedSearchParams(
  input:
    | Record<string, string | string[] | undefined> // Server
    | URLSearchParams // Client
    | ReadonlyURLSearchParams // Client
): SearchParamsValues {
  const normalized =
    input && typeof (input as URLSearchParams | ReadonlyURLSearchParams).entries === "function"
      ? normalizeClientSearchParams(input as URLSearchParams | ReadonlyURLSearchParams)
      : normalizeServerSearchParams(input as Record<string, string | string[] | undefined>);

  return searchParamsSchema.parse(normalized);
}