import styles from './Description.module.css';

export default function Description({ description }) {
  return (
    <div className={styles.description}>
      <h2 className={styles.title}>소개</h2>
      <p className={styles.text}>{description}</p>
    </div>
  );
}
