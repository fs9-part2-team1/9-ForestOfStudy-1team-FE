import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TodayHabitPage.module.css';
import MainLayout from '@/layouts/MainLayout';
import Modal from '@/components/Modal/Modal';
import { mockData } from '@/data/mock-data';

import trashIcon from '@/assets/icons/common/ic_trash.png';
import arrowRightIcon from '@/assets/icons/common/ic_arrow_right.png';

export default function TodayHabitPage() {
  const today = new Date().toISOString().split('T')[0];
  const [habitDate, setHabitDate] = useState({
    [today]: mockData[0].habits.map((habit) => ({
      ...habit,
      completed: false,
    })),
  });
  const [currentTime, setCurrentTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replaceAll('. ', '-')
        .replace('.', '');
      const time = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(`${date} ${time}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const habits = habitDate[today] || [];

  const allUniqueHabits = [
    ...new Map(
      Object.values(habitDate)
        .flat()
        .map((item) => [item.id, item]),
    ).values(),
  ];

  const addHabit = () => {
    const newHabit = {
      id: Date.now(),
      name: '새로운 습관',
      week: Array(7).fill(true),
      completed: false,
    };
    const todayHabits = habitDate[today] || [];
    setHabitDate({ ...habitDate, [today]: [...todayHabits, newHabit] });
  };

  const deleteHabit = (id) => {
    const newHabitDate = { ...habitDate };
    for (const date in newHabitDate) {
      newHabitDate[date] = newHabitDate[date].filter((h) => h.id !== id);
    }
    setHabitDate(newHabitDate);
  };

  const toggleHabit = (id) => {
    const todayHabits = habitDate[today] || [];
    const updatedTodayHabits = todayHabits.map((h) =>
      h.id === id ? { ...h, completed: !h.completed } : h,
    );
    setHabitDate({ ...habitDate, [today]: updatedTodayHabits });
  };

  const editHabitName = (id, value) => {
    const newHabitDate = { ...habitDate };
    for (const date in newHabitDate) {
      newHabitDate[date] = newHabitDate[date].map((h) =>
        h.id === id ? { ...h, name: value } : h,
      );
    }
    setHabitDate(newHabitDate);
  };

  const goToFocusPage = () => navigate('/today-focus');
  const goToHomePage = () => navigate('/');

  return (
    <MainLayout disabled={true}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>연우의 개발공장</h2>
            </div>
            <div className={styles.headerBtns}>
              <button className={styles.whiteBtn} onClick={goToFocusPage}>
                오늘의 집중
                <img
                  src={arrowRightIcon}
                  alt="화살표"
                  className={styles.arrowIcon}
                />
              </button>
              <button className={styles.whiteBtn} onClick={goToHomePage}>
                홈
                <img
                  src={arrowRightIcon}
                  alt="화살표"
                  className={styles.arrowIcon}
                />
              </button>
            </div>
            <div className={styles.timeWrapper}>
              <p className={styles.subtitle}>현재 시간</p>
              <div className={styles.time}>{currentTime}</div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>오늘의 습관</h3>
              <button
                className={styles.linkBtn}
                onClick={() => setIsModalOpen(true)}
              >
                목록 수정
              </button>
            </div>
            {habits.length === 0 ? (
              <p className={styles.empty}>
                습관이 없어요
                <br />
                목록 수정을 눌러 습관을 생성해보세요
              </p>
            ) : (
              <ul className={styles.habitList}>
                {habits.map((habit) => (
                  <li
                    key={habit.id}
                    className={`${styles.habitItem} ${
                      habit.completed ? styles.done : ''
                    }`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.name || '새 습관'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalWrapper}>
          <Modal isOpen={isModalOpen} title="습관 목록">
            <div className={styles.habitModal}>
              <ul className={styles.habitEditList}>
                {allUniqueHabits.map((habit) => (
                  <li key={habit.id} className={styles.habitRow}>
                    <div className={styles.habitBox}>
                      <input
                        type="text"
                        value={habit.name}
                        onChange={(e) =>
                          editHabitName(habit.id, e.target.value)
                        }
                        className={styles.habitInput}
                      />
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <img src={trashIcon} alt="삭제" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.addRow}>
                <button className={styles.plusBtn} onClick={addHabit}>
                  +
                </button>
              </div>
              <div className={styles.modalBtns}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className={styles.confirmBtn}
                  onClick={() => setIsModalOpen(false)}
                >
                  수정 완료
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </MainLayout>
  );
}
