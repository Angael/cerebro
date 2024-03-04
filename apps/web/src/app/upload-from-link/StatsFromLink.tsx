import React from "react";
import numeral from "numeral";

import css from "./StatsFromLink.module.scss";
import Card from "@/styled/card/Card";
import clsx from "clsx";

type Props = {
  stats: any;
  isFetching: boolean;
  isError?: boolean;
};

const StatsFromLink = ({ stats, isFetching, isError }: Props) => {
  const { title, duration, thumbnail, resolution, fps, ext, filesize_approx } =
    stats ?? {
      title: "Title of video",
      duration: 0,
      thumbnail: "https://placehold.co/600x300/EEE/31343C",
      resolution: "0x0",
      fps: 0,
      ext: "ext",
      filesize_approx: 0,
    };

  const sizeStr = numeral(filesize_approx).format("0.00 b");
  const durationStr = numeral(duration).format("00:00:00");

  return (
    <Card
      className={clsx(css.StatsFromLink, isError && css.error)}
      style={{ opacity: isFetching ? 0.5 : 1 }}
    >
      <img src={thumbnail} alt="thumbnail" className={css.thumbnail} />
      <div className={css.content}>
        <header className={"h3 " + css.title}>{title}</header>

        <div className={css.stats}>
          <p>Duration: {durationStr}s</p>
          <p>Resolution: {resolution}</p>
          <p>FPS: {fps}</p>
          <p>Ext: {ext}</p>
          <p>Filesize: {sizeStr}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsFromLink;
