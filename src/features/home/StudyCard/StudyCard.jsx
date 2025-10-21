import leaf from '@/assets/icons/common/ic_leaf.png';
import styles from './StudyCard.module.css';
import { EmojiCard } from '@/components';

function daysSinceCreated(date) {
  const createdDate = new Date(date);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - createdDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function StudyCard({ data, studyCardClassName, onClick }) {
  const {
    nickname,
    title,
    description,
    points,
    createdAt,
    reactions = [],
  } = data;

  const MAX_VISIBLE = 3;
  const visibleEmojis = reactions?.slice(0, MAX_VISIBLE);

  return (
    <article
      className={`${styles.studyCard} ${studyCardClassName}`}
      onClick={onClick}
    >
      <header className={styles.contents}>
        <section className={styles.topContents}>
          <h1 className={styles.title}>
            <span>{nickname}</span> 의 {title}
          </h1>
          <div className={styles.getPoint}>
            <div className={styles.pointBox}>
              <img className={styles.leaf} src={leaf} alt="획득 포인트" />
              {points}P 획득
            </div>
          </div>
        </section>
        <section className={styles.bottomContents}>
          <p className={styles.calculateDays}>
            {`${daysSinceCreated(createdAt)}일째 진행 중`}
          </p>
          <p className={styles.description}>{description}</p>
        </section>
      </header>
      <footer className={styles.emojiGap}>
        {visibleEmojis.map((reaction, i) => (
          <EmojiCard
            cardClassName={styles.cardClassName}
            emojiBoxClassName={styles.emojiBoxClassName}
            emojiClassName={styles.emojiClassName}
            countClassName={styles.countClassName}
            key={i}
            emoji={reaction.emoji}
            count={reaction.count}
          />
        ))}
      </footer>
    </article>
  );
}
//48-26/ 56-31
