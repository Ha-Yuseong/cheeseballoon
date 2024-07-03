"use client";

/* eslint-disable camelcase */

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "src/app/(main)/searchresult/searchresult.module.scss";
import empty from "src/stores/Frame 114.png";
import a_icon from "src/stores/afreeca_icon.png";
import cnt from "src/stores/cnt_icon.png";
import no_image from "src/stores/no_image.png";
import no_image_profile from "src/stores/no_image_profile.png";
import soop from "src/stores/soop_icon.png";
import on_air from "src/stores/on_air.png";

interface data_2 {
  data:
    | {
        streamerId: number;
        liveId: number;
        name: string;
        title: string;
        thumbnailUrl: string;
        platform: string;
        profileUrl: string;
        category: string; // category 속성 추가
        viewerCnt: number;
        streamUrl: string;
        channelUrl: string;
      }[]
    | null;
}

interface data_3 {
  data:
    | {
        // streamId: number;
        streamerId: number;
        name: string;
        isLive: boolean;
        profileUrl: string;
        channelUrl: string;
        follower: number;
        platform: string;
      }[]
    | null;
}

export default function SearchResult() {
  const cheese_api = process.env.NEXT_PUBLIC_CHEESEBALLOON_API;
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [visibleStreamerCount, setVisibleStreamerCount] = useState(12);
  const [streamerIncrement, setStreamerIncrement] = useState(12);
  const [visibleLiveCount, setVisibleLiveCount] = useState(12);
  const [liveIncrement, setLiveIncrement] = useState(12);

  const [searchStreamerResults, setSearchStreamerResults] = useState<data_3>({
    data: null,
  });
  const [searchLiveResults, setSearchLiveResults] = useState<data_2>({
    data: null,
  });

  const loadMoreStreamers = () => {
    setVisibleStreamerCount((prevCount) => prevCount + streamerIncrement);
  };
  const loadMoreLives = () => {
    setVisibleLiveCount((prevCount) => prevCount + liveIncrement);
  };

  useEffect(() => {
    fetch(`${cheese_api}/streamer/search?query=${query}`, {})
      .then((response) => response.json())
      .then((data) => {
        setSearchStreamerResults(data);
      });
    fetch(`${cheese_api}/live/search?query=${query}`, {})
      .then((response) => response.json())
      .then((data) => {
        setSearchLiveResults(data);
      });
  }, [cheese_api, query]);

  return (
    <div className={styles.searchresult}>
      <div className={styles.top}>
        <p className={styles.title}>검색결과</p>
        <p className={styles.sub_title}>
          입력하신 <span>‘{query}’ </span>을(를) 포함한 스트리머와 LIVE 방송
          결과입니다.
        </p>
      </div>
      <div className={styles.streamer_title}>스트리머</div>
      <div className={styles.streamer_list}>
        {searchStreamerResults.data && searchStreamerResults.data.length > 0 ? (
          searchStreamerResults.data
            .slice(0, visibleStreamerCount)
            .map((streamer) => (
              <div key={streamer.streamerId} className={styles.streamer}>
                {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                <a
                  href={`https://cheeseballoon.site/detail/${streamer.streamerId}`}
                  className={styles.hyper_link}
                >
                  <div className={styles.streamer_thumbnail}>
                    <img
                      src={streamer.profileUrl}
                      alt=""
                      onError={(
                        e: React.SyntheticEvent<HTMLImageElement, Event>
                      ) => {
                        e.currentTarget.src = no_image.src; // Set the source to the fallback image
                      }}
                    />
                  </div>
                </a>
                <div className={styles.streamer_info}>
                  <div className={styles.first_container}>
                    <div className={styles.platform}>
                      {streamer.platform === "A" && (
                        <img src={a_icon.src} alt="Platform A" />
                      )}
                      {streamer.platform === "C" && (
                        <img
                          src="https://cdn.mhns.co.kr/news/photo/202401/570626_699706_5828.png"
                          alt="Platform C"
                        />
                      )}
                    </div>
                    <a
                      href={`https://cheeseballoon.site/detail/${streamer.streamerId}`}
                      className={styles.hyper_link}
                    >
                      <div className={styles.streamer_name}>
                        {streamer.name}
                      </div>
                    </a>
                  </div>
                  <div className={styles.followers}>
                    팔로워 {streamer.follower}명
                  </div>
                </div>
                <div className={styles.favorites}>
                  <img src={empty.src} alt="ss" />
                </div>
              </div>
            ))
        ) : (
          <div className={styles.no_data}>조회된 내역이 없습니다.</div>
        )}
        {searchStreamerResults.data &&
          searchStreamerResults.data.length > visibleStreamerCount && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className={styles.more} onClick={loadMoreStreamers}>
              <p>더보기 ▽</p>
            </div>
          )}
      </div>
      <div className={styles.live_list_title}>LIVE</div>
      <div className={styles.responsive_live_content}>
        <div className={styles.responsive_live_flexbox}>
          {searchLiveResults.data && searchLiveResults.data.length > 0 ? (
            searchLiveResults.data.slice(0, visibleLiveCount).map((live) => (
              // eslint-disable-next-line react/jsx-key
              <div key={live.liveId} className={styles.responsive_live_item}>
                <a
                  href={live.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className={styles.responsive_first_row}>
                    {/* 라이브 썸네일 */}
                    <div className={styles.responsive_live_thumbnail_box}>
                      <img
                        src={live.thumbnailUrl}
                        className={styles.responsive_live_thumbnail}
                        alt="123"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                          e.currentTarget.src = no_image.src; // Set the source to the fallback image
                        }}
                      />
                      {/* 가로정렬 */}
                      <div className={styles.responisve_on_air_box}>
                        <img
                          src={on_air.src}
                          alt="on_air"
                          className={styles.responisve_on_air}
                        />
                      </div>
                      <div className={styles.responisve_view}>
                        {live.viewerCnt}명 시청중
                      </div>
                    </div>
                  </div>
                </a>
                {/* bj 썸네일 & 제목 & bj 이름 가로정렬 */}
                <div className={styles.responsive_second_row}>
                  <a
                    href={`https://cheeseballoon.site/detail/${live.streamerId}`}
                    className={styles.hyper_link}
                  >
                    <div className={styles.responisve_bj_thumbnail_box}>
                      <img
                        className={styles.responsive_bj_thumbnail}
                        src={live.profileUrl}
                        alt="ss"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                          e.currentTarget.src = no_image_profile.src; // Set the source to the fallback image
                        }}
                      ></img>
                    </div>
                  </a>
                  {/* 제목, bj 이름 세로정렬 */}
                  <div className={styles.responisve_info}>
                    <a
                      href={live.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.hyper_link}
                    >
                      <div className={styles.responisve_live_title}>
                        {live.title}
                      </div>
                    </a>
                    <a
                      href={`https://cheeseballoon.site/detail//${live.streamerId}`}
                      className={styles.hyper_link}
                    >
                      <div className={styles.responisve_bj_name}>
                        {live.name}
                      </div>
                    </a>
                  </div>
                </div>
                <div className={styles.responsive_third_container}>
                  <div className={styles.responsive_platfrom_box}>
                    {live.platform === "A" && (
                      <img
                        className={styles.responisve_platform}
                        src={a_icon.src}
                        alt="Platform A"
                      />
                    )}
                    {live.platform === "C" && (
                      <img
                        className={styles.responisve_platform}
                        src="https://cdn.mhns.co.kr/news/photo/202401/570626_699706_5828.png"
                        alt="Platform C"
                      />
                    )}
                    {live.platform === "S" && (
                      <img
                        className={styles.responisve_platform}
                        src={a_icon.src}
                        alt="S"
                      />
                    )}
                  </div>
                  <div className={styles.responsive_category}>
                    {live.category}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.no_data}>조회된 내역이 없습니다.</div>
          )}
          {searchLiveResults.data &&
            searchLiveResults.data.length > visibleLiveCount && (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div className={styles.more} onClick={loadMoreLives}>
                <p>더보기 ▽</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
