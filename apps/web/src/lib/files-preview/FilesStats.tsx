import React from "react";
import numeral from "numeral";
import css from "./FilesStats.module.scss";
import { Icon } from "@mdi/react";
import { mdiChartLine, mdiHarddisk, mdiSigma, mdiSizeXl } from "@mdi/js";
import { ExtendedFile } from "@/app/upload/files/uploadTypes";
import Card from "@/styled/card/Card";

interface IProps {
  files: ExtendedFile[];
}

const FilesStats = ({ files }: IProps) => {
  let summedSize, avgSize, minSize, maxSize;
  let types: string[] = [];
  if (!files || !files.length) {
    summedSize = 0;
    avgSize = 0;
    minSize = 0;
    maxSize = 0;
    types = [];
  } else {
    types = [
      ...new Set<string>(
        files.map((file) => file.file.type.replace("image/", "")),
      ),
    ];
    const sizes = files.map((file) => file.file.size);
    summedSize = sizes.reduce((a, b) => a + b, 0);

    avgSize = summedSize / sizes.length;
    minSize = Math.min(...sizes);
    maxSize = Math.max(...sizes);
  }

  if (files.length < 2) {
    return null;
  }

  return (
    <Card className={css.uploadFileStats}>
      <div className={css.fileStat}>
        <Icon path={mdiSigma} size={2} />
        <p>{files.length}</p>
        <p className="body2">Files</p>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiHarddisk} size={2} />
        <p>{numeral(summedSize).format("0.00 b")}</p>
        <p className="body2">Sum</p>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiChartLine} size={2} />
        <p>{numeral(avgSize).format("0.00 b")}</p>
        <p className="body2">Avg</p>
      </div>
      <div className={css.fileStat}>
        <Icon path={mdiSizeXl} size={2} />
        <p>{numeral(maxSize).format("0.00 b")}</p>
        <p className="body2">Biggest</p>
      </div>
      {/*<p>{types.join(',')}</p>*/}
    </Card>
  );
};

export default FilesStats;
