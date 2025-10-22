import { useEffect, useState } from 'react';
import { Container } from '@/components';
import { StudyCard } from '..';
import styles from './RecentStudy.module.css';

export default function RecentStudy({ studyCardClassName }) {
  const [recentStudies, setRecentStudies] = useState([]);

  // 로컬스토리지에서 최근 조회 스터디 가져오기
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentStudies')) || [];
    setRecentStudies(stored);
  }, []);

  return (
    <Container containerClassName={styles.container}>
      <h1 className={styles.title}>최근 조회한 스터디</h1>
      {recentStudies.length > 0 ? (
        <div className={styles.studyCardSection}>
          {recentStudies.map((data) => (
            <StudyCard
              key={data.id}
              data={data}
              studyCardClassName={studyCardClassName}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noDataScript}>
          <p>아직 조회된 스터디가 없어요</p>
        </div>
      )}
    </Container>
  );
}
