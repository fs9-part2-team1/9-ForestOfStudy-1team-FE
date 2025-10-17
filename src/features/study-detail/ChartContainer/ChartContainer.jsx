import { HabitChart } from '@/features/study-detail';
import styles from './ChartContainer.module.css';

export default function ChartContainer({ habits }) {
  return (
    <div className={styles.ChartContainer}>
      <h3 className={styles.title}>습관 기록표</h3>
      <div className={styles.habitChart}>
        {habits && habits.length > 0 ? (
          <HabitChart habits={habits} />
        ) : (
          <div className={styles.noDataScript}>
            <p>아직 습관이 없어요</p>
            <p>오늘의 습관에서 습관을 생성해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
