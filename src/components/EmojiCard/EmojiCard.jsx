import styles from './EmojiCard.module.css';

export function EmojiCard({ emoji, count }) {
  return (
    <div className={styles.emojiCard}>
      <span className={styles.emojiType}>{emoji}</span>
      <span className={styles.emojiCount}>{count}</span>
    </div>
  );
}
