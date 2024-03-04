import type { FrontItem } from "@vanih/cerebro-contracts";
import { MD_CELL_SIZE } from "@/utils/consts";

export const getGridSpan = (item: FrontItem): "" | "tall" | "wide" => {
  let w, h;
  if (item.type === "VIDEO") {
    w = item.video.width;
    h = item.video.height;
  }
  if (item.type === "IMAGE") {
    w = item.image?.width;
    h = item.image?.height;
  }

  if (!h || !w) {
    return "";
  }
  const howWide = w / h;

  if (howWide >= 1.35 && w >= 2 * MD_CELL_SIZE && h >= MD_CELL_SIZE) {
    return "wide";
  } else if (howWide <= 0.75 && w >= MD_CELL_SIZE && h >= 2 * MD_CELL_SIZE) {
    return "tall";
  } else {
    return "";
  }
};
