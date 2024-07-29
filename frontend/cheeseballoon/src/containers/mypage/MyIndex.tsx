import styles from "src/containers/mypage/MyIndex.module.scss";
import CardCarousel from "src/components/mypage/CardCarousel";
import ViewLog from "src/components/mypage/ViewLog";
import fav from "public/svgs/fav.svg";
import history from "public/svgs/history.svg";
import Image from "next/image";

export default function MyPage() {
  return (
    <div className={styles.ranking}>
      <p className={styles.title}>마이페이지</p>
      <div className={styles.wrapper}>
        <div className={styles.subtitle}>
          즐겨찾기한 스트리머 목록과 시청 기록을 확인하세요.
        </div>
      </div>
      <div className={styles.carousel}>
        <div className={styles.favtitle}>
          <Image src={fav} alt="" width={22} height={22} />
          <span>즐겨찾기</span>
        </div>
        <CardCarousel />
      </div>
      <div className={styles.viewlog}>
        <div className={styles.viewtitle}>
          <Image src={history} alt="" width={22} height={22} />
          <span> 시청기록</span>
        </div>
        <ViewLog />
      </div>
    </div>
  );
}
