"use client";

import style from "src/components/ranking/RestRanking.module.scss";
import Image from "next/image";
import aflogo from "src/stores/afreeca.ico";
import chzlogo from "public/svgs/chzzk.svg";
// import nofav from "public/svgs/nofav.svg";
// import fav from "public/svgs/fav.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import noimage from "public/svgs/blank_profile.png";
import { useState, useEffect } from "react";
import ArrowUp from "public/svgs/uparrow.png";
import ArrowDown from "public/svgs/downarrow.png";
import {
  isMobileState,
  // isSignInState,
  // useAlertStore,
  // useFavStore,
} from "src/stores/store";
// import { useNotification } from "src/lib/NotificationContext";
// import customFetch from "src/lib/CustomFetch";

type RankingData = {
  streamerId: number;
  profileUrl: string;
  name: string;
  platform: string;
  diff: number;
  rankDiff?: number;
  value: string;
  category?: string;
  streamUrl?: string;
  // bookmark?: boolean;
  liveId?: number;
  liveLogId?: number;
};

type Props = {
  data: RankingData[] | undefined;
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

export default function RestRanking({ data }: Props) {
  const pathname = usePathname()?.split("/").pop() || "";
  const [updatedUrls, setUpdatedUrls] = useState<Record<number, string>>({});
  // const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const isMobile = isMobileState((state) => state.isMobile);
  // const isSign = isSignInState((state) => state.isSignIn);
  // const { showNotification } = useNotification();
  // const { showAlert, showConfirm } = useAlertStore((state) => ({
  // showAlert: state.showAlert,
  // showConfirm: state.showConfirm,
  // }));
  // const fetchData = useFavStore((state) => state.fetchData);

  useEffect(() => {
    if (data) {
      const initialUrls = data.reduce(
        (acc, item) => {
          acc[item.streamerId] = fixProfileUrl(item.profileUrl);
          return acc;
        },
        {} as Record<number, string>
      );
      setUpdatedUrls(initialUrls);

      // const initialBookmarks = data.reduce(
      //   (acc, item) => {
      //     acc[item.streamerId] = item.bookmark || false;
      //     return acc;
      //   },
      //   {} as Record<number, boolean>
      // );
      // setBookmarks(initialBookmarks);
    }
  }, [data]);

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
        setUpdatedUrls((prev) => ({
          ...prev,
          [id]: fixProfileUrl(newProfileUrl),
        }));
      }
    } catch (error) {
      noop();
    }
  };

  // const toggleBookmark = async (item: RankingData) => {
  //   if (!isSign) {
  //     showAlert("로그인이 필요한 서비스입니다");
  //     return;
  //   }

  //   try {
  //     let response;
  //     if (bookmarks[item.streamerId]) {
  //       const confirmed = await showConfirm("삭제하시겠습니까?");
  //       if (!confirmed) return;
  //       response = await customFetch(
  //         `${process.env.NEXT_PUBLIC_MYPAGE_DBOOK}`,
  //         {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             streamerId: item.streamerId,
  //           }),
  //         }
  //       );
  //     } else {
  //       response = await customFetch(`${process.env.NEXT_PUBLIC_MYPAGE_BOOK}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           streamerId: item.streamerId,
  //         }),
  //       });
  //     }

  //     if (response && response.status === 401) {
  //       showAlert("로그인이 필요한 서비스입니다");
  //       return;
  //     }

  //     showNotification(
  //       bookmarks[item.streamerId]
  //         ? "즐겨찾기가 삭제되었습니다."
  //         : "즐겨찾기가 추가되었습니다."
  //     );

  //     await fetchData();
  //     setBookmarks((prev) => ({
  //       ...prev,
  //       [item.streamerId]: !prev[item.streamerId],
  //     }));
  //   } catch (error) {
  //     showAlert("로그인이 필요한 서비스입니다");
  //   }
  // };

  // const handleLinkClick = async (item: RankingData) => {
  //   await customFetch(`${process.env.NEXT_PUBLIC_MYPAGE_VIEW}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       liveId: item.liveId,
  //       liveLogId: item.liveLogId,
  //     }),
  //   });
  // };

  return (
    <div className={style.container}>
      {data &&
        (isMobile ? data : data.slice(3)).map((item, index) => (
          <div key={index} className={style.subitem}>
            {isMobile && pathname === "live" && (
              <div className={style.liveindex}>{index + 1}</div>
            )}
            {isMobile && pathname !== "live" && (
              <div className={style.index}>{index + 1}</div>
            )}
            {!isMobile && pathname === "live" && (
              <div className={style.liveindex}>{index + 4}</div>
            )}
            {!isMobile && pathname !== "live" && (
              <div className={style.index}>{index + 4}</div>
            )}
            {pathname === "live" ? (
              <>
                <div className={style.livenameinfo}>
                  <div className={style.image}>
                    <Link href={`/detail/${item.streamerId}`}>
                      <div className={style.imageWrapper}>
                        <Image
                          src={updatedUrls[item.streamerId] || noimage.src}
                          alt=""
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 6vw, 48px"
                          onError={() => handleImageError(item.streamerId)}
                        />
                      </div>
                    </Link>
                  </div>
                  <div className={style.livename}>
                    <Link
                      href={`/detail/${item.streamerId}`}
                      className={style.link}
                    >
                      {item.name}
                    </Link>
                    <span className={style.logo}>
                      {item.platform === "A" || item.platform === "S" ? (
                        <Image src={aflogo} alt="" width={14} height={14} />
                      ) : (
                        <Image src={chzlogo} alt="" width={15} height={15} />
                      )}
                    </span>
                  </div>
                </div>
                <div className={style.livetitleinfo}>
                  <Link
                    href={item.streamUrl || ""}
                    className={style.link}
                    target="_blank"
                    // onClick={() => handleLinkClick(item)}
                  >
                    {item.value}
                  </Link>
                </div>
                {!isMobile && (
                  <div className={style.livesubinfo}>
                    <Link
                      href={`/live?category=${item.category}`}
                      className={style.link}
                    >
                      {item.category}
                    </Link>
                  </div>
                )}
                {!isMobile && (
                  <div className={style.liveinfo}>
                    {item.diff.toLocaleString()}
                  </div>
                )}
                {/* {!isMobile && (
                  <div className={style.livefav}>
                    <Image
                      src={bookmarks[item.streamerId] ? fav : nofav}
                      alt=""
                      width={20}
                      height={20}
                      onClick={() => toggleBookmark(item)}
                      role="presentation"
                    />
                  </div>
                )} */}
              </>
            ) : (
              <>
                <div className={style.nameinfo}>
                  <div className={style.image}>
                    <Link href={`/detail/${item.streamerId}`}>
                      <div className={style.imageWrapper}>
                        <Image
                          src={updatedUrls[item.streamerId] || noimage.src}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 6vw, 48px"
                          style={{ objectFit: "cover" }}
                          onError={() => handleImageError(item.streamerId)}
                        />
                      </div>
                    </Link>
                  </div>
                  <div className={style.name}>
                    <Link
                      href={`/detail/${item.streamerId}`}
                      className={style.link}
                    >
                      <div className={style.caneli}>{item.name}</div>
                    </Link>{" "}
                    {item.platform === "A" || item.platform === "S" ? (
                      <Image src={aflogo} alt="" width={15} height={15} />
                    ) : (
                      <Image src={chzlogo} alt="" width={15} height={15} />
                    )}
                  </div>
                  {item.rankDiff !== undefined && (
                    <div className={style.rank}>
                      {item.rankDiff > 0 && (
                        <>
                          <div className={style.arrow}>
                            <Image
                              src={ArrowUp}
                              alt=""
                              sizes="(max-width: 768px) 1.2vw, 7px"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <span>{Math.abs(item.rankDiff)}</span>
                        </>
                      )}
                      {item.rankDiff < 0 && (
                        <>
                          <div className={style.arrow}>
                            <Image
                              src={ArrowDown}
                              sizes="(max-width: 768px) 1.2vw, 7px"
                              alt=""
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <span>{Math.abs(item.rankDiff)}</span>
                        </>
                      )}
                      {item.rankDiff === 0 && (
                        <div className={style.zero}>( - )</div>
                      )}
                    </div>
                  )}
                </div>
                <div className={style.info}>
                  {item.value}{" "}
                  {pathname === "rating" && (
                    <>
                      {item.diff > 0 && (
                        <span className={style.positive}>
                          (+ {Math.abs(item.diff).toFixed(2)})
                        </span>
                      )}
                      {item.diff < 0 && (
                        <span className={style.negative}>
                          (- {Math.abs(item.diff).toFixed(2)})
                        </span>
                      )}
                      {item.diff === 0 && (
                        <span className={style.zero}>( - )</span>
                      )}
                    </>
                  )}
                  {pathname === "time" && (
                    <>
                      {item.diff > 0 && (
                        <span className={style.positive}>
                          (+{" "}
                          {`${Math.floor(Math.abs(item.diff) / 3600)
                            .toString()
                            .padStart(2, "0")}h ${Math.floor(
                            (Math.abs(item.diff) % 3600) / 60
                          )
                            .toString()
                            .padStart(2, "0")}m`}
                          )
                        </span>
                      )}
                      {item.diff < 0 && (
                        <span className={style.negative}>
                          (-{" "}
                          {`${Math.floor(Math.abs(item.diff) / 3600)
                            .toString()
                            .padStart(2, "0")}h ${Math.floor(
                            (Math.abs(item.diff) % 3600) / 60
                          )
                            .toString()
                            .padStart(2, "0")}m`}
                          )
                        </span>
                      )}
                      {item.diff === 0 && (
                        <span className={style.zero}>( - )</span>
                      )}
                    </>
                  )}
                  {pathname !== "rating" && pathname !== "time" && (
                    <>
                      {item.diff > 0 && (
                        <span className={style.positive}>
                          (+ {Math.abs(item.diff).toLocaleString()})
                        </span>
                      )}
                      {item.diff < 0 && (
                        <span className={style.negative}>
                          (- {Math.abs(item.diff).toLocaleString()})
                        </span>
                      )}
                      {item.diff === 0 && (
                        <span className={style.zero}>( - )</span>
                      )}
                    </>
                  )}
                </div>
                {/* {!isMobile && (
                  <div className={style.fav}>
                    <Image
                      src={bookmarks[item.streamerId] ? fav : nofav}
                      alt=""
                      width={20}
                      height={20}
                      onClick={() => toggleBookmark(item)}
                      role="presentation"
                    />
                  </div>
                )} */}
              </>
            )}
          </div>
        ))}
    </div>
  );
}
