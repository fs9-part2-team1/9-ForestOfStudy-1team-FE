import icLeaf from '@/assets/icons/common/ic_leaf.png';
import styles from './StudyCard.module.css';

function daysSinceCreated(date) {
  const createdDate = new Date(date);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - createdDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

function StudyCard({ item }) {
  return (
    <div className={styles.card}>
      <div className={styles.summary}>
        <div className={styles.title}>
          <h2>
            <span>{item.nickname}</span>
            {`의 ${item.title}`}
          </h2>
          <div className={styles.point}>
            <img src={icLeaf} alt="잎사귀" />
            <span>{item.points}P 획득</span>
          </div>
        </div>
        <div className={styles.days}>
          {`${daysSinceCreated(item.createdAt)}일째 진행 중`}
        </div>
        <div className={styles.description}>{item.description}</div>
      </div>
      {/* <FavoriteTag /> */}
    </div>
  );
}

export default StudyCard;
