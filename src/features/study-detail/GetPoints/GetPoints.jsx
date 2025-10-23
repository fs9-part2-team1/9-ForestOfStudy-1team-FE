import leaf from '@/assets/icons/common/ic_leaf.png';
import styles from './GetPoints.module.css';
import { useEffect } from 'react';
import { useState } from 'react';

export default function GetPoints({ points }) {
  const [updatePoints, setUpdatePoints] = useState(points);

  useEffect(() => {
    const studyId = localStorage.getItem('currentStudyId');
    if (!studyId) return;

    const storedPoints = JSON.parse(
      localStorage.getItem('studyPoints') || '{}',
    );
    setUpdatePoints(storedPoints[studyId] ?? points);
  }, [points]);

  return (
    <div className={styles.getPoint}>
      <h2 className={styles.title}>현재까지 획득한 포인트</h2>
      <div className={styles.pointBox}>
        <img className={styles.leaf} src={leaf} alt="획득 포인트" />
        {updatePoints}P 획득
      </div>
    </div>
  );
}
