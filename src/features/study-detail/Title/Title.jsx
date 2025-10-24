import { EditStudyModal } from '..';
import right_arrow from '@/assets/icons/common/ic_arrow_right.png';
import styles from './Title.module.css';

export default function Title({ data }) {
  const { nickname, title, password, id } = data;

  return (
    <div className={styles.Title}>
      <h1 className={styles.studyName}>
        {nickname}의 {title}
      </h1>

      <div className={styles.btnGroup}>
        <EditStudyModal
          buttonText={
            <>
              오늘의 습관
              <img
                className={styles.rightArrow}
                src={right_arrow}
                alt="오늘의 습관으로 이동"
              />
            </>
          }
          confirmText="오늘의 습관으로 가기"
          nickname={nickname}
          title={title}
          password={password}
          btnClassName={styles.goToPageBtn}
          redirectTo={`/today-habit/${id}`} // 이동할 경로 전달
        />

        <EditStudyModal
          buttonText={
            <>
              오늘의 집중
              <img
                className={styles.rightArrow}
                src={right_arrow}
                alt="오늘의 집중으로 이동"
              />
            </>
          }
          confirmText="오늘의 집중으로 가기"
          nickname={nickname}
          title={title}
          password={password}
          btnClassName={styles.goToPageBtn}
          redirectTo={`/today-focus/${id}`}
        />
      </div>
    </div>
  );
}
