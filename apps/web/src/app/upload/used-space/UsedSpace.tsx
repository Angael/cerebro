import React from "react";
import numeral from "numeral";
import { fetchAccountLimits } from "@/app/upload/used-space/fetchAccountLimits";
import ProgressBar from "@/styled/progress-bar/ProgressBar";

type Props = {};

const UsedSpace = async () => {
  const limits = await fetchAccountLimits();

  const value = limits ? (100 * limits.bytes.used) / limits.bytes.max : 0;
  const usageString =
    numeral(limits.bytes.used).format("0 b") +
    " out of " +
    numeral(limits.bytes.max).format("0 b");

  return (
    <ProgressBar
      id="used-space"
      label={"Used space: " + usageString}
      value={value}
      max={100}
    />
  );
};

export default UsedSpace;
