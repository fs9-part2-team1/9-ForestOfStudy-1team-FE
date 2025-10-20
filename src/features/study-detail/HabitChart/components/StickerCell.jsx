import stickerWhite from '@/assets/icons/sticker/sticker_white.png';
import styles from '../HabitChart.module.css';

export default function StickerCell({ done, sticker }) {
  return (
    <div className={styles.checkBtn}>
      <img
        src={done ? sticker : stickerWhite}
        alt="habit"
        className={styles.sticker}
      />
    </div>
  );
}
