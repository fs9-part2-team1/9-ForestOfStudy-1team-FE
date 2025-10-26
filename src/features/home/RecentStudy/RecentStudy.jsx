import { useEffect, useState } from 'react';
import { Container } from '@/components';
import { StudyCard } from '..';
import { studyAPI } from '@/api/studyAPI';
import styles from './RecentStudy.module.css';

export default function RecentStudy({ studyCardClassName }) {
  const [recentStudies, setRecentStudies] = useState([]);

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem('recentStudies')) || [];

    const fetchRecentStudies = async () => {
      try {
        const results = await Promise.allSettled(
          storedIds.map((study) => studyAPI.getStudyById(study.id)),
        );

        const fulfilledStudies = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value);

        setRecentStudies(fulfilledStudies);

        const validIds = fulfilledStudies.map((s) => ({ id: s.id }));
        localStorage.setItem('recentStudies', JSON.stringify(validIds));
      } catch (error) {
        console.error('최근 조회한 스터디 불러오기 실패', error);
      }
    };

    if (storedIds.length > 0) {
      fetchRecentStudies();
    }
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
