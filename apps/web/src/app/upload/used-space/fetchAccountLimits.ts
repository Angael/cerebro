"use server";
import { auth } from "@clerk/nextjs";
import { BackendApi, getApiHeaders } from "@/utils/backend-api";

type Limits = {
  type: string; //AccountType;
  bytes: {
    used: number;
    max: number;
  };
};

export const fetchAccountLimits = async (): Promise<Limits> => {
  const clerkToken = auth();

  const limitsResponse = await BackendApi.get("/account/limits", {
    headers: await getApiHeaders(clerkToken),
  });

  return limitsResponse.data;
};
