import { useState } from 'react';
import { CustomToast } from '@/components/CustomToast/CustomToast';
import styles from './ShareButton.module.css';

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  return (
    <>
      <button className={styles.shareBtn} onClick={handleShare}>
        공유하기
      </button>

      {showToast && (
        <CustomToast message="🔗 링크가 복사되었습니다!" type="success" />
      )}
    </>
  );
}
