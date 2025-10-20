import styles from './HomePage.module.css';

function RecentStudySection() {
  return (
    <div className="recentStudyContainer">
      <h1 className={styles.sectionTitle}>최근 조회한 스터디</h1>
      <div className="RecentStudyCardSection"></div>
    </div>
  );
}

export default RecentStudySection;
