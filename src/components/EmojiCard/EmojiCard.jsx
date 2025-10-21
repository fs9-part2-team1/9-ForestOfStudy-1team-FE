import styles from './EmojiCard.module.css';

export function EmojiCard({
  emoji,
  count,
  cardClassName,
  emojiBoxClassName,
  emojiClassName,
  countClassName,
}) {
  return (
    <div className={`${styles.emojiCard} ${cardClassName}`}>
      <div className={`${styles.emojiBox} ${emojiBoxClassName}`}>
        <span className={`${styles.emojiType} ${emojiClassName}`}>{emoji}</span>
        <span className={`${styles.emojiCount} ${countClassName}`}>
          {count}
        </span>
      </div>
    </div>
  );
}
