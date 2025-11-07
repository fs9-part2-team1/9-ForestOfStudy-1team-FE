import { useNavigate } from 'react-router-dom';
import { EmojiCard } from '@/components';
import { BACKGROUND } from './backgroundImg';
import leaf from '@/assets/icons/common/ic_leaf.png';
import styles from './StudyCard.module.css';

function daysSinceCreated(date) {
  const createdDate = new Date(date);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - createdDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function StudyCard({ data, studyCardClassName }) {
  const {
    nickname,
    title,
    description,
    createdAt,
    reactions = [],
    background,
    points,
  } = data;

  const MAX_VISIBLE = 3;
  const visibleEmojis = reactions?.slice(0, MAX_VISIBLE);

  const navigate = useNavigate();

  // 스터디 카드 클릭 시 currentStudyId 업데이트
  const handleClick = () => {
    const stored = JSON.parse(localStorage.getItem('recentStudies')) || [];
    const updated = [
      data,
      ...stored.filter((item) => item.id !== data.id),
    ].slice(0, 3);

    localStorage.setItem('recentStudies', JSON.stringify(updated));
    localStorage.setItem('currentStudyId', data.id);

    navigate(`/study-detail/${data.id}`);
  };

  const backgroundValue = BACKGROUND[background];
  const isImage = backgroundValue && !backgroundValue.startsWith('#');

  const backgroundStyle = isImage
    ? {
        backgroundImage: `url(${backgroundValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
      }
    : { backgroundColor: backgroundValue };

  return (
    <article
      className={`${styles.studyCard} ${studyCardClassName}  ${isImage ? styles.imageCard : ''}`}
      onClick={handleClick}
      style={backgroundStyle}
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
          <p
            className={`${styles.calculateDays} ${
              isImage ? styles.whiteText : ''
            }`}
          >
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
