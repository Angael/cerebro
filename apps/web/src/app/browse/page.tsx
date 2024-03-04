import React from "react";
import { BackendApi, getApiHeaders } from "@/utils/backend-api";
import { auth } from "@clerk/nextjs";
import Pagination from "@/lib/pagination/Pagination";
import ItemGrid from "@/lib/item-grid/ItemGrid";

type Props = {
  searchParams: { page?: string };
};

const BrowsePage = async ({ searchParams: { page } }: Props) => {
  const clerkToken = auth();
  // console.log("clerkToken", clerkToken);
  // console.log("Token: ", await clerkToken.getToken());

  const pageNr = parseInt(page ?? "1");
  const { data } = await BackendApi.get("/items", {
    params: { limit: 10, page: pageNr - 1 },
    headers: await getApiHeaders(clerkToken),
  });
  const { count, items } = data;

  const pageCount = Math.ceil(count / 10);

  return (
    <>
      <Pagination page={pageNr} pageCount={pageCount} />
      {items?.length > 0 && <ItemGrid items={items} key={page} />}
      <Pagination page={pageNr} pageCount={pageCount} />
    </>
  );
};

export default BrowsePage;
