import React, { ComponentPropsWithoutRef } from "react";

import css from "./IconBtn.module.scss";
import { styled } from "../styled";
import clsx from "clsx";

const _Btn = styled<"button", { href?: string }>("button", css.iconBtn);

type Props = {
  filled?: boolean;
  disabled?: boolean;
} & ComponentPropsWithoutRef<typeof _Btn>;

const IconBtn = ({ as, filled, className, ...props }: Props) => {
  return (
    <_Btn
      as={as}
      className={clsx(className, filled && css.filled)}
      tabIndex={0}
      {...props}
    />
  );
};

export default IconBtn;
