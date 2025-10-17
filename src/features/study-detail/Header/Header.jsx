import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { EmojiCard } from '@/components';
import plus_white from '@/assets/icons/common/ic_plus_white.png';
import icon_smile from '@/assets/icons/common/ic_smile.png';
import styles from './Header.module.css';
import { EditStudyModal } from '..';
import { CustomToast } from '@/components/CustomToast/CustomToast';

export default function Header({ data, onDelete }) {
  const { reactions: initialReactions, nickname, title, password } = data;

  const [showAll, setShowAll] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isOpenPicker, setIsOpenPicker] = useState(false);
  const [reactions, setReactions] = useState(initialReactions);

  const MAX_VISIBLE = 3;
  const visibleEmojis = reactions.slice(0, MAX_VISIBLE);
  const hiddenEmojis = reactions.slice(MAX_VISIBLE);
  const hiddenCount = hiddenEmojis.length;

  const handleToggle = () => {
    setShowAll((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  const handleTogglePicker = () => {
    setIsOpenPicker((prev) => !prev);
  };

  const onEmojiPick = (emojiData) => {
    const emoji = emojiData.emoji;

    const exists = reactions.find((r) => r.emoji === emoji);
    if (exists) {
      setReactions((prev) =>
        prev.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r)),
      );
    } else {
      setReactions((prev) => [...prev, { emoji, count: 1 }]);
    }

    setIsOpenPicker(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.emojiGroup}>
        <div className={styles.emoji}>
          {visibleEmojis.map((reaction, i) => (
            <EmojiCard key={i} emoji={reaction.emoji} count={reaction.count} />
          ))}

          {hiddenCount > 0 && (
            <button className={styles.moreShowBtn} onClick={handleToggle}>
              <img className={styles.plus} src={plus_white} alt="더보기" />
              {hiddenCount}..
            </button>
          )}

          {showAll && hiddenCount > 0 && (
            <div className={styles.emojiModal}>
              <div className={styles.emojiModalContent}>
                {hiddenEmojis.map((reaction, i) => (
                  <EmojiCard
                    key={i}
                    emoji={reaction.emoji}
                    count={reaction.count}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.emojiPickerContainer}>
          <button className={styles.addBtn} onClick={handleTogglePicker}>
            <img className={styles.smile} src={icon_smile} alt="웃는 이모지" />
            추가
          </button>

          {isOpenPicker && (
            <div className={styles.pickerWrapper}>
              <EmojiPicker
                className={styles.emojiPicker}
                onEmojiClick={onEmojiPick}
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionBtn}>
        <button className={styles.shareBtn} onClick={handleShare}>
          공유하기
        </button>

        <p className={styles.line}>|</p>

        <EditStudyModal
          buttonText="수정하기"
          nickname={nickname}
          title={title}
          password={password}
          btnClassName={styles.headerEditBtn}
          redirectTo="/make-study"
        />

        <p className={styles.line}>|</p>

        <EditStudyModal
          buttonText="스터디 삭제하기"
          nickname={nickname}
          title={title}
          password={password}
          btnClassName={styles.headerDeleteBtn}
          onDelete={onDelete}
        />
      </div>

      {showToast && (
        <CustomToast
          show={showToast}
          message="🔗 링크가 복사되었습니다!"
          type="share"
        />
      )}
    </div>
  );
}
