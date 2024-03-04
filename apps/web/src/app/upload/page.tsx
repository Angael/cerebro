import React, { Suspense } from "react";
import UploadFiles from "@/app/upload/files/UploadFiles";
import ProgressBar from "@/styled/progress-bar/ProgressBar";
import UsedSpace from "@/app/upload/used-space/UsedSpace";

const page = () => {
  return (
    <div className="flex col gap-2">
      <Suspense
        fallback={
          <ProgressBar
            id="used-space"
            label={"Loading used space..."}
            value={0}
            max={100}
          />
        }
      >
        <UsedSpace />
      </Suspense>
      <UploadFiles />
    </div>
  );
};

export default page;
