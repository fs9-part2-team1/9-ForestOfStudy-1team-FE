import { StickerCell } from '.';
import styles from '../HabitChart.module.css';

export default function HabitRow({ habit, rowIndex, getStickerRow }) {
  return (
    <div className={styles.habitRow}>
      <div className={styles.habitName}>{habit.name}</div>
      <div className={styles.statusCells}>
        {habit.week.map((done, i) => (
          <StickerCell key={i} done={done} sticker={getStickerRow(rowIndex)} />
        ))}
      </div>
    </div>
  );
}
