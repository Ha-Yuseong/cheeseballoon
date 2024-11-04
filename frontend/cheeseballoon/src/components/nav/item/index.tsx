"use client";

import { useState } from "react";
import style from "src/components/nav/item/index.module.scss";
import Shortcut from "src/components/nav/item/ShortCut";
// import Fav from "src/components/nav/item/FavIndex";
import Recomend from "src/components/nav/item/RecomendIndex";
import {
  useToggleState,
  isMobileState,
  // accessTokenState,
  // isSignInState,
} from "src/stores/store";

export default function Menu() {
  const [isHovered, setIsHovered] = useState(false);
  const { value } = useToggleState();
  const isMobile = isMobileState((state) => state.isMobile);
  // const isSign = isSignInState((state) => state.isSignIn);

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`${style.body} ${value ? style.open : ""} ${
        !value && isHovered ? style.hovered : ""
      }`}
      onMouseEnter={() => !value && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Shortcut value={value} />
      {/* {isSign && <Fav value={value} />} */}
      <Recomend value={value} />
    </div>
  );
}
