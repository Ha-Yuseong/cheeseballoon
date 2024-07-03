"use client";

import styles from "src/components/ranking/RankingIndexCard.module.scss";
import Image from "next/image";
import ArrowUp from "public/svgs/uparrow.png";
import ArrowDown from "public/svgs/downarrow.png";
import aflogo from "public/svgs/afreeca.svg";
import chzlogo from "public/svgs/chzzk.svg";
import Link from "next/link";
import noimage from "public/svgs/blank_profile.png";
import { useState, useEffect } from "react";
import {
  FollowRankData,
  AvgRankData,
  TopviewRankData,
  TimeRankData,
  RatingRankData,
  LiveRankData,
} from "src/types/type";

type Props = {
  item:
    | FollowRankData
    | AvgRankData
    | TopviewRankData
    | TimeRankData
    | RatingRankData
    | LiveRankData;
  title: string;
  number: number;
};

function noop() {}

const fixProfileUrl = (url: string) => {
  if (url === "default" || url === "None") {
    return noimage.src;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
};

export default function RankCard({ item, title, number }: Props) {
  let logo = null;
  if (item.platform === "A" || item.platform === "S") {
    logo = aflogo;
  } else if (item.platform === "C") {
    logo = chzlogo;
  }
  const RenderRank = title !== "실시간 LIVE";
  const [profileUrl, setProfileUrl] = useState<string>("");

  const handleImageError = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_PF_UPDATE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamer_id: id }),
      });
      const datas = await response.json();
      const newProfileUrl = datas.detail.profile_url;
      if (newProfileUrl) {
        setProfileUrl(fixProfileUrl(newProfileUrl));
      }
    } catch (error) {
      noop();
    }
  };

  useEffect(() => {
    if (item) {
      setProfileUrl(fixProfileUrl(item.profileUrl));
    }
  }, [item]);

  return (
    <div className={styles.container}>
      <div className={styles.number}>{number}</div>
      <div className={styles.image}>
        <Link href={`/detail/${item.streamerId}`}>
          <Image
            src={profileUrl || noimage.src}
            alt=""
            width={44}
            height={44}
            onError={() => {
              handleImageError(item.streamerId);
            }}
          />
        </Link>
      </div>
      <div className={styles.name}>
        <Link href={`/detail/${item.streamerId}`} className={styles.link}>
          {item.name}
        </Link>{" "}
        {logo && <Image src={logo} alt="" width={16} height={16} />}
      </div>
      {RenderRank && (
        <div className={styles.rank}>
          {item.rankDiff !== undefined && item.rankDiff > 0 && (
            <>
              <Image src={ArrowUp} alt="" width={7} height={12} />
              <span>{Math.abs(item.rankDiff)}</span>
            </>
          )}
          {item.rankDiff !== undefined && item.rankDiff < 0 && (
            <>
              <Image src={ArrowDown} alt="" width={7} height={12} />
              <span>{Math.abs(item.rankDiff)}</span>
            </>
          )}
          {item.rankDiff === 0 && <div className={styles.zero}>-</div>}
        </div>
      )}
    </div>
  );
}
