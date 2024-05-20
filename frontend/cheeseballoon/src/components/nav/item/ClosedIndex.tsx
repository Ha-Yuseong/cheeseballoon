"use client";

import style from "src/components/nav/item/ClosedIndex.module.scss";
import Shortcut from "src/components/nav/item/ShortCut";
import Fav from "src/components/nav/item/FavIndex";
import Recomend from "src/components/nav/item/RecomendIndex";

export default function Closed() {
  return (
    <div className={style.body}>
      <Shortcut />
      <Fav />
      <Recomend />
    </div>
  );
}