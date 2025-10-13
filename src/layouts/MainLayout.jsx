import logo from '@/assets/images/logo/img_logo_default.png';
import styles from './MainLayout.module.css';

export default function MainLayout({ disabled, children }) {
  return (
    <>
      <header className={styles.header}>
        <img className={styles.logo} src={logo} alt="로고" />
        {!disabled && (
          <button className={styles.makeStudyBtn}>스터디 만들기</button>
        )}
      </header>
      {children}
    </>
  );
}
