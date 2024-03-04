import React from "react";

import css from "./Btn.module.scss";
import { styled } from "../styled";
import Link from "next/link";

// TODO: check all if used or usable
// TODO: restyle
export const Btn = styled("button", css.btnStyle);
export const BtnA = styled("a", css.btnStyle);
export const BtnLink = styled(Link, css.btnStyle);
