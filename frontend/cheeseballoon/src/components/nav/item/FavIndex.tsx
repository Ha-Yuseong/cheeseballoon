"use client";

import styles from "src/components/nav/item/FavIndex.module.scss";
import FavCard from "src/components/nav/item/FavCard";
import Image from "next/image";
import arrow from "public/svgs/down_arrow.png";
import { useState, useEffect } from "react";
import { useFavStore } from "src/stores/store";

interface ValueProps {
  value: boolean;
}

export interface FavState {
  bookmarkId: number;
  streamerId: number;
  name: string;
  platform: string;
  streamUrl: string;
  profileUrl: string;
  followerCnt: number;
  isLive: boolean;
}

export default function Fav({ value }: ValueProps) {
  const [toggle1, setToggle] = useState(false);
  const favData = useFavStore((state) => state.favData);
  const fetchData = useFavStore((state) => state.fetchData);
  const switchToggle = () => {
    setToggle(!toggle1);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (favData === null) {
    return null;
  }

  const visibleData = favData.slice(0, 5);
  const hiddenData = favData.length > 5 ? favData.slice(5) : null;

  return (
    <div className={value ? styles.open_container : styles.closed_container}>
      <div
        className={value ? styles.open_description : styles.closed_description}
      >
        즐겨찾기
      </div>
      {visibleData.map((item, index) => (
        <div key={index}>
          <FavCard data={item} />
        </div>
      ))}
      {toggle1 && hiddenData && (
        <>
          {hiddenData.map((item, index1) => (
            <div key={index1}>
              <FavCard data={item} />
            </div>
          ))}
        </>
      )}
      {hiddenData !== null && (
        <>
          {!toggle1 && (
            <div
              className={
                value ? styles.open_morecontent : styles.closed_morecontent
              }
              onClick={switchToggle}
              onKeyDown={switchToggle}
              role="presentation"
            >
              {value ? "더보기" : ""}
              &nbsp;
              <Image src={arrow} alt="" />
            </div>
          )}
          {toggle1 && (
            <div
              className={
                value ? styles.open_morecontent : styles.closed_morecontent
              }
              onClick={switchToggle}
              onKeyDown={switchToggle}
              role="presentation"
            >
              {value ? "접기" : ""}
              <div
                className={
                  value ? styles.open_image_rotate : styles.closed_image_rotate
                }
              >
                <Image src={arrow} alt="" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
