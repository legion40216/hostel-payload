import { getValidatedSearchParams } from "@/utils/parseSearchParams";
import HomepageView from "./views/homepage-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from 'next/navigation';
import { getRedirectUrlIfInvalid } from '@/utils/validateAndRedirect';

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawSearchParams = await props.searchParams;
  const validatedParams = getValidatedSearchParams(rawSearchParams);

  // Check if URL has invalid params and redirect if needed
  const redirectUrl = getRedirectUrlIfInvalid(rawSearchParams, validatedParams);
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.hostels.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomepageView searchParams={validatedParams} />
    </HydrationBoundary>
  );
}