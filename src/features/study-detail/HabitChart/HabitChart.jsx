import styles from './HabitChart.module.css';
import stickerWhite from '@/assets/icons/sticker/sticker_white.png';
import green100 from '@/assets/icons/sticker/sticker_light_green_100_01.png';
import green200 from '@/assets/icons/sticker/sticker_light_green_100_02.png';
import green3 from '@/assets/icons/sticker/sticker_light_green_100_03.png';
import mint100 from '@/assets/icons/sticker/sticker_light_mint_100_04.png';
import mint200 from '@/assets/icons/sticker/sticker_light_mint_200_05.png';
import green4 from '@/assets/icons/sticker/sticker_green_06.png';
import blue100 from '@/assets/icons/sticker/sticker_blue_100_07.png';
import blue200 from '@/assets/icons/sticker/sticker_blue_200_08.png';
import blue300 from '@/assets/icons/sticker/sticker_blue_300_09.png';
import purple100 from '@/assets/icons/sticker/sticker_purple_100_10.png';
import purple200 from '@/assets/icons/sticker/sticker_purple_200_11.png';
import purple300 from '@/assets/icons/sticker/sticker_purple_300_12.png';
import yellow100 from '@/assets/icons/sticker/sticker_yellow_100_13.png';
import yellow200 from '@/assets/icons/sticker/sticker_yellow_200_14.png';
import yellow300 from '@/assets/icons/sticker/sticker_yellow_300_15.png';
import pink100 from '@/assets/icons/sticker/sticker_pink_100_16.png';
import pink200 from '@/assets/icons/sticker/sticker_pink_200_17.png';
import pink300 from '@/assets/icons/sticker/sticker_pink_300_18.png';

const allStickers = [
  green100,
  green200,
  green3,
  mint100,
  mint200,
  green4,
  blue100,
  blue200,
  blue300,
  purple100,
  purple200,
  purple300,
  yellow100,
  yellow200,
  yellow300,
  pink100,
  pink200,
  pink300,
];

const days = ['월', '화', '수', '목', '금', '토', '일'];

export default function HabitChart({ habits }) {
  const getStickerList = (rowIndex) => {
    const stickerIndex = rowIndex % allStickers.length;
    return allStickers[stickerIndex];
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.headerRow}>
        <div className={styles.emptyHeader}></div>
        <div className={styles.daysHeader}>
          {days.map((day, i) => (
            <div key={i} className={styles.dayCell}>
              {day}
            </div>
          ))}
        </div>
      </div>

      {habits.map((habit, rowIndex) => (
        <div key={habit.id} className={styles.habitRow}>
          <div className={styles.habitName}>{habit.name}</div>
          <div className={styles.statusCells}>
            {habit.week.map((done, i) => (
              <div key={i} className={styles.checkBtn}>
                <div className={styles.checkBtn}>
                  <img
                    src={done ? getStickerList(rowIndex) : stickerWhite}
                    alt="habit"
                    className={styles.sticker}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
