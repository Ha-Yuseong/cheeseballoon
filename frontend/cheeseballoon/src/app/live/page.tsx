import LiveHeader from "@/src/containers/live/liveHeader";
import LiveList from "@/src/containers/live/liveList";
import LiveCategory from "@/src/containers/live/liveCategory";
import style from "./page.module.scss";

export default function LivePage() {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <LiveHeader />
        </div>
        <hr />
        <div className={style.search}>
          <LiveCategory />
        </div>
        <hr />
        <div className={style.live}>
          <LiveList />
        </div>
        <hr />
      </div>
    </div>
  );
}
