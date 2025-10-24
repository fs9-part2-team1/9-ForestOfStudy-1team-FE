import leaf from '@/assets/icons/common/ic_leaf.png';
import styles from './GetPoints.module.css';

export default function GetPoints({ points }) {
  return (
    <div className={styles.getPoint}>
      <h2 className={styles.title}>현재까지 획득한 포인트</h2>
      <div className={styles.pointBox}>
        <img className={styles.leaf} src={leaf} alt="획득 포인트" />
        {points}P 획득
      </div>
    </div>
  );
}
