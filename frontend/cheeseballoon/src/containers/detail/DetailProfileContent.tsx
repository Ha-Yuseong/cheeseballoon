"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import customFetch from "src/lib/CustomFetch";
import { useNotification } from "src/lib/NotificationContext";
import afreeca from "src/stores/afreeca.ico";
import chzzk from "public/svgs/chzzk.svg";
import error from "public/svgs/blank_profile.png";
import style from "src/containers/detail/DetailProfileContent.module.scss";
import favorite from "public/svgs/fav.svg";
import noFavorite from "public/svgs/nofav.svg";
import { isSignInState, useAlertStore, useFavStore } from "src/stores/store";

interface StreamerDataType {
  streamId: number;
  originId: string;
  name: string;
  profileUrl: string;
  channelUrl: string;
  platform: string;
  bookmark: boolean;
}

interface RankDataType {
  rank: number;
  diff: number;
}
interface LiveDataType {
  live: boolean;
  streamerUrl: string;
  thumbnailUrl: string;
}

const STREAMER_API_URL = process.env.NEXT_PUBLIC_STREAMER_API_URL;
const STREAMER_LIVE_API_URL = process.env.NEXT_PUBLIC_STREAMER_LIVE_API_URL;
const SUMMARY_API_URL = process.env.NEXT_PUBLIC_SUMMARY_API_URL;
const BOOKMARK_API_URL = process.env.NEXT_PUBLIC_BOOKMARK_API_URL;
const BOOKMARK_DELETE_API_URL = process.env.NEXT_PUBLIC_BOOKMARK_DELETE_API_URL;

async function getData(url: string) {
  const res = await customFetch(url);
  return res.json();
}

export default function DetailProfileContent() {
  const { id } = useParams();
  const [streamerData, setStreamerData] = useState<StreamerDataType | null>(
    null
  );
  const [rankData, setRankData] = useState<RankDataType | null>(null);
  const [liveData, setLiveData] = useState<LiveDataType | null>(null);
  const [bookmarkChange, setBookmarkChange] = useState<boolean>(false);
  const isSignIn = isSignInState((state) => state.isSignIn);
  const router = useRouter();
  const { showNotification } = useNotification();
  const { showAlert, showConfirm } = useAlertStore((state) => ({
    showAlert: state.showAlert,
    showConfirm: state.showConfirm,
  }));
  const favFetched = useFavStore((state) => state.fetchData);

  useEffect(() => {
    const fetchData = async () => {
      const streamerDataResponse = await getData(`${STREAMER_API_URL}${id}`);
      const rankDataResponse = await getData(`${SUMMARY_API_URL}${id}`);
      const liveDataResponse = await getData(`${STREAMER_LIVE_API_URL}${id}`);

      if (streamerDataResponse.status === "OK") {
        setStreamerData(streamerDataResponse.data);
      } else {
        router.push("/home");
      }
      if (streamerDataResponse.status === "OK") {
        setRankData(rankDataResponse.data);
      }
      if (streamerDataResponse.status === "OK") {
        setLiveData(liveDataResponse.data);
      }
    };

    fetchData();
  }, [id, router, bookmarkChange]);

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const handleBookmark = async () => {
    if (!isSignIn) {
      showAlert("로그인이 필요한 서비스입니다");
      return;
    }

    try {
      let response;
      if (streamerData?.bookmark) {
        const confirmed = await showConfirm("삭제하시겠습니까?");
        if (!confirmed) return;

        response = await customFetch(
          `${BOOKMARK_DELETE_API_URL}?streamerId=${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ streamerId: id }),
          }
        );
      } else {
        response = await customFetch(`${BOOKMARK_API_URL}?streamerId=${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ streamerId: id }),
        });
      }

      if (response && response.status === 401) {
        showAlert("로그인이 필요한 서비스입니다");
        return;
      }

      showNotification(
        streamerData?.bookmark
          ? "즐겨찾기가 삭제되었습니다."
          : "즐겨찾기가 추가되었습니다."
      );

      await favFetched();
      setBookmarkChange((prevState) => !prevState);
    } catch (err) {
      showAlert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    streamerData &&
    rankData && (
      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          event.stopPropagation();
          handleOpenUrl(streamerData.channelUrl);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleOpenUrl(streamerData.channelUrl);
          }
        }}
        className={style.wrapper}
      >
        <div className={style["image-container"]}>
          <img
            className={`${style["profile-image"]} ${liveData && liveData.live ? style.live : null}`}
            src={streamerData.profileUrl}
            alt="프로필"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = error.src;
            }}
          />
        </div>
        <div>
          <div className={style["logo-and-name"]}>
            {streamerData.platform === "C" ? (
              <img className={style["platform-logo"]} src={chzzk.src} alt="" />
            ) : (
              <img
                className={style["platform-logo"]}
                src={afreeca.src}
                alt=""
              />
            )}
            <div className={style.name}>{streamerData.name}</div>
          </div>
        </div>
        <div className={style.rank}>
          <div className={style["rank-num"]}># {rankData.rank}</div>
          <div
            className={`${style["rank-diff"]} ${rankData.diff > 0 && style.negative} ${rankData.diff < 0 && style.positive}`}
          >
            {rankData.diff > 0 && `(↓${rankData.diff} )`}
            {rankData.diff === 0 && "( - )"}
            {rankData.diff < 0 && `(↑${rankData.diff.toString().slice(1)} )`}
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.stopPropagation();
              handleBookmark();
            }
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleBookmark();
          }}
          className={style.favorite}
        >
          {streamerData.bookmark ? (
            <img
              src={favorite.src}
              alt="즐겨찾기"
              className={style["favorite-image"]}
            />
          ) : (
            <img
              src={noFavorite.src}
              alt="즐겨찾기"
              className={style["favorite-image"]}
            />
          )}
        </div>
      </div>
    )
  );
}
