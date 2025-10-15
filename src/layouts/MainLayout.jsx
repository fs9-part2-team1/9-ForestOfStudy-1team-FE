import logoDefault from '@/assets/images/logo/img_logo_default.png';
import logoMobile from '@/assets/images/logo/img_logo_small.png';
import styles from './MainLayout.module.css';
import { useState } from 'react';
import { useEffect } from 'react';

export default function MainLayout({ disabled, children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoImg = isMobile ? logoMobile : logoDefault;

  return (
    <>
      <header className={styles.header}>
        <img className={styles.logo} src={logoImg} alt="로고" />
        {!disabled && (
          <button className={styles.makeStudyBtn}>스터디 만들기</button>
        )}
      </header>
      {children}
    </>
  );
}
