import styles from '../HabitChart.module.css';

const days = ['월', '화', '수', '목', '금', '토', '일'];

export default function HabitChartHeader() {
  return (
    <div className={styles.headerRow}>
      <div className={styles.emptyHeader}></div>
      <div className={styles.daysHeader}>
        {days.map((day) => (
          <div key={day} className={styles.dayCell}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
