import styles from './Container.module.css';

export function Container({ children, containerClassName }) {
  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {children}
    </div>
  );
}
