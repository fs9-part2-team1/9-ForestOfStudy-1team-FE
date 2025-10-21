import { useState } from 'react';
import selectIcon from '@/assets/icons/common/ic_toggle.png';
import styles from './CustomSelect.module.css';

export default function CustomSelect({
  value,
  onChange,
  optionList,
  resetCount,
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    if (resetCount) resetCount(); // StudyContents에서 setVisibleCount 초기화용
  };

  return (
    <div className={styles.customSelect}>
      <button
        type="button"
        className={styles.selectBtn}
        onClick={() => setOpen((prev) => !prev)}
      >
        {optionList.find((item) => item.value === value)?.label}
        <span className={styles.arrow}>
          <img className={styles.selectIcon} src={selectIcon} alt="옵션 선택" />
        </span>
      </button>

      {open && (
        <ul className={styles.optionList}>
          {optionList.map((item) => (
            <li
              key={item.value}
              className={`${styles.option} ${
                item.value === value ? styles.active : ''
              }`}
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
