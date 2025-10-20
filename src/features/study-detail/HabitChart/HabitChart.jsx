import { HabitChartHeader, HabitRow, getStickerRow } from './components';
import styles from './HabitChart.module.css';

export default function HabitChart({ habits }) {
  return (
    <div className={styles.gridContainer}>
      <HabitChartHeader />
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
