import { HabitChartHeader, HabitRow, getStickerRow } from './components';
import styles from './HabitChart.module.css';

export default function HabitChart({ habits }) {
  if (!habits || habits.length === 0) return null;

  return (
    <div className={styles.gridContainer}>
      <HabitChartHeader habits={habits} />
      {habits.map((habit, rowIndex) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          rowIndex={rowIndex}
          getStickerRow={getStickerRow}
        />
      ))}
    </div>
  );
}
