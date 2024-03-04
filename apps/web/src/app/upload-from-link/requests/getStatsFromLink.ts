"use server";

import { BackendApi, getApiHeaders } from "@/utils/backend-api";
import { auth } from "@clerk/nextjs";

export const getStatsFromLink = async (link: string) => {
  const clerkToken = auth();

  const response = await BackendApi.get("/items/upload/file-from-link", {
    params: { link },
    headers: await getApiHeaders(clerkToken),
  });

  return response.data;
};
