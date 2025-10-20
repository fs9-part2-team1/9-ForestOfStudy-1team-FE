import { Container } from '@/components';
import styles from './RecentStudy.module.css';
import { StudyCard } from '..';

export default function RecentStudy({ data }) {
  const TEST_NO_DATA = 0;
  return (
    <Container containerClassName={styles.container}>
      <h1 className={styles.title}>최근 조회한 스터디</h1>
      {TEST_NO_DATA && TEST_NO_DATA.length > 0 ? (
        <StudyCard data={data} />
      ) : (
        <div className={styles.noDataScript}>
          <p>아직 조회된 스터디가 없어요</p>
        </div>
      )}
    </Container>
  );
}
