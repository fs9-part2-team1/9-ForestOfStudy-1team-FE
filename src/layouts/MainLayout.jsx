import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDefault from '@/assets/images/logo/img_logo_default.png';
import logoMobile from '@/assets/images/logo/img_logo_small.png';
import styles from './MainLayout.module.css';

export default function MainLayout({ disabled, children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoImg = isMobile ? logoMobile : logoDefault;

  const handleMainHome = () => {
    navigate('/');
  };

  const handleMakeStudy = () => {
    navigate('/make-study');
  };

  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.logo}
          src={logoImg}
          alt="로고"
          onClick={handleMainHome}
        />
        {!disabled && (
          <button className={styles.makeStudyBtn} onClick={handleMakeStudy}>
            스터디 만들기
          </button>
        )}
      </header>
      {children}
    </>
  );
}
