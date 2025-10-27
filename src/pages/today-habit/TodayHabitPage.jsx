import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Container } from '@/components';
import styles from './TodayHabitPage.module.css';
import MainLayout from '@/layouts/MainLayout';
import Modal from '@/components/Modal/Modal';
import trashIcon from '@/assets/icons/common/ic_trash.png';
import arrowRightIcon from '@/assets/icons/common/ic_arrow_right.png';

export default function TodayHabitPage() {
  const { id } = useParams(); // studyId
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [currentTime, setCurrentTime] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [study, setStudy] = useState(null);
  const [habitDate, setHabitDate] = useState({});

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

  // 스터디 정보 및 습관 목록 가져오기
  useEffect(() => {
    const fetchStudyAndHabits = async () => {
      try {
        const studyRes = await axios.get(`/api/study/${id}`);
        const studyData = studyRes.data;
        setStudy(studyData);

        const habitRes = await axios.get(`/api/study/${id}/habit`);
        const habits = habitRes.data.map((habit) => ({
          ...habit,
          habitRecord: habit.habitRecord || [],
        }));

        setHabitDate({ [today]: habits });
      } catch (err) {
        console.error('스터디 또는 습관 데이터를 불러오지 못했습니다:', err);
        setStudy(null);
      }
    };

    fetchStudyAndHabits();
  }, [id, today]);

  if (!study) {
    return (
      <MainLayout>
        <Container disabled>
          <p>해당 스터디를 찾을 수 없습니다.</p>
        </Container>
      </MainLayout>
    );
  }

  const habits = habitDate[today] || [];

  const allUniqueHabits = [
    ...new Map(
      Object.values(habitDate)
        .flat()
        .map((habit) => [habit.id, habit]),
    ).values(),
  ];

  // 습관 추가
  const addHabit = async () => {
    try {
      const res = await axios.post(`/api/study/${id}/habit`, {
        name: '새로운 습관',
      });

      const newHabit = {
        ...res.data.habit,
        habitRecord: [],
      };

      setHabitDate((prev) => ({
        ...prev,
        [today]: [...(prev[today] || []), newHabit],
      }));
    } catch (err) {
      console.error('습관 추가 실패:', err);
    }
  };

  // 습관 수정
  const editHabitName = async (habitId, value) => {
    try {
      await axios.patch(`/api/habit/${habitId}`, { name: value });

      setHabitDate((prev) => {
        const updated = {};
        for (const date in prev) {
          updated[date] = prev[date].map((h) =>
            h.id === habitId ? { ...h, name: value } : h,
          );
        }
        return updated;
      });
    } catch (err) {
      console.error('습관 수정 실패:', err);
    }
  };

  // 습관 삭제
  const deleteHabit = async (habitId) => {
    try {
      await axios.delete(`/api/habit/${habitId}`);

      setHabitDate((prev) => {
        const updated = {};
        for (const date in prev) {
          updated[date] = prev[date].filter((h) => h.id !== habitId);
        }
        return updated;
      });
    } catch (err) {
      console.error('습관 삭제 실패:', err);
    }
  };

  // 완료 토글
  const toggleHabit = (id) => {
    const todayHabits = habitDate[today] || [];
    const updatedTodayHabits = todayHabits.map((h) => {
      if (h.id === id) {
        const record = h.habitRecord.find((r) =>
          r.recordDate.startsWith(today),
        );
        if (record) record.done = !record.done;
        else
          h.habitRecord.push({
            recordDate: today + 'T00:00:00.000Z',
            done: true,
          });
      }
      return h;
    });
    setHabitDate({ ...habitDate, [today]: updatedTodayHabits });
  };

  const goToFocusPage = () => navigate(`/today-focus/${id}`);
  const goToHomePage = () => navigate(`/study-detail/${id}`);

  return (
    <MainLayout disabled={true}>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>
                {study.nickname}의 {study.title}
              </h2>
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
                      habit.habitRecord.find((r) =>
                        r.recordDate.startsWith(today),
                      )?.done
                        ? styles.done
                        : ''
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
