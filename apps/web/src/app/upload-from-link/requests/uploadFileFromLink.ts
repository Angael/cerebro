"use server";
import { auth } from "@clerk/nextjs";
import { BackendApi, getApiHeaders } from "@/utils/backend-api";

export const uploadFileFromLink = async (link: string) => {
  const clerkToken = auth();

  const response = await BackendApi.post(
    "/items/upload/file-from-link",
    { link },
    {
      headers: await getApiHeaders(clerkToken),
    },
  );

  return response.body;
};
