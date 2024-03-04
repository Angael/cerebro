"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiArrowLeft } from "@mdi/js";

const GoBackLink = () => {
  const router = useRouter();

  return (
    <Link
      href="/browse"
      onClick={router.back}
      className="flex center"
      style={{ alignSelf: "flex-start" }}
    >
      <Icon path={mdiArrowLeft} size={0.8} />
      Go back
    </Link>
  );
};

export default GoBackLink;
