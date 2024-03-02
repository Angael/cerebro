"use client";
import React from "react";
import { nanoid } from "nanoid";

type Props = {};

const clientCmp = (_props: Props) => {
  const [count, setCount] = React.useState(0);

  return (
    <div {..._props}>
      Counter: {count}{" "}
      <button suppressHydrationWarning onClick={() => setCount(count + 1)}>
        Increment {nanoid()}
      </button>
    </div>
  );
};

export default clientCmp;
