import { StickerCell } from '.';
import {
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday,
} from 'date-fns';
import styles from '../HabitChart.module.css';

const dayCheckers = [
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  isSunday, //check Day
];

export default function HabitRow({ habit, rowIndex, getStickerRow }) {
  // week 배열 초기화
  const week = Array(7).fill(false);

  habit.habitRecord.forEach((record) => {
    const date = new Date(record.recordDate); //문자열을 JS Date객체로 -> 요일체크위함
    const index = dayCheckers.findIndex((checkDay) => checkDay(date)); // date가 어느 요일인지 판단
    // 해당되는 요일이 week 배열에 존재하면, 없으면 -1 반환
    if (index !== -1) week[index] = record.done; //해당 요일에 기록 있으면 done으로 값 변경
  });

  return (
    <div className={styles.habitRow}>
      <div className={styles.habitName}>{habit.name}</div>
      <div className={styles.statusCells}>
        {week.map((done, i) => (
          <StickerCell key={i} done={done} sticker={getStickerRow(rowIndex)} />
        ))}
      </div>
    </div>
  );
}
