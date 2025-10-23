import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TodayHabitPage.module.css';
import MainLayout from '@/layouts/MainLayout';
import Modal from '@/components/Modal/Modal';
import { mockData } from '@/data/mock-data';
import trashIcon from '@/assets/icons/common/ic_trash.png';
import arrowRightIcon from '@/assets/icons/common/ic_arrow_right.png';
import { Container } from '@/components';

export default function TodayHabitPage() {
  // URL에서 ID 가져오고 스터디 선택
  const { id } = useParams();
  const navigate = useNavigate();
  const study = mockData.find((d) => d.id === id);

  // 오늘 날짜 정의
  const today = new Date().toISOString().split('T')[0];

  // 상태 정의
  const [currentTime, setCurrentTime] = useState(''); // 현재 시간
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열고 닫기

  // 날짜별 습관 상태 저장 {id, name, habitRecord: [{recordDate, done}]}
  const [habitDate, setHabitDate] = useState({
    [today]: study?.habits?.map((habit) => ({
      ...habit,
      habitRecord: habit.habitRecord || [],
    })),
  });

  // 현재 시간 업데이트
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

  // URL에 맞는 스터디가 없는 경우
  if (!study) {
    return (
      <MainLayout>
        <Container disabled>
          <p>해당 스터디를 찾을 수 없습니다.</p>
        </Container>
      </MainLayout>
    );
  }

  // 오늘 습관 배열 (= 오늘의 습관들)
  const habits = habitDate[today] || [];

  // 전체 습관 배열 생성
  const allUniqueHabits = [
    ...new Map(
      Object.values(habitDate)
        .flat()
        .map((habit) => [habit.id, habit]),
    ).values(),
  ];

  // 습관 추가 : 오늘 습관 배열에 새 습관 추가(현재 시간, 체크 유무 저장)
  const addHabit = () => {
    const newHabit = {
      id: Date.now().toString(),
      name: '새로운 습관',
      habitRecord: [{ recordDate: today + 'T00:00:00.000Z', done: false }],
    };
    const todayHabits = habitDate[today] || [];
    setHabitDate({ ...habitDate, [today]: [...todayHabits, newHabit] });
  };

  // 습관 삭제 : 날짜별 모든 습관에서 해당 ID 삭제
  const deleteHabit = (id) => {
    const newHabitDate = { ...habitDate };
    for (const date in newHabitDate) {
      newHabitDate[date] = newHabitDate[date].filter((h) => h.id !== id);
    }
    setHabitDate(newHabitDate);
  };

  // 습관 완료 토글 : 오늘 습관 클릭 시 완료/미완료 토글, 오늘 기록이 없으면 새로 생성
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

  // 습관 이름 수정 : 입력값 변경 시 습관 이름 업데이트
  const editHabitName = (id, value) => {
    const newHabitDate = { ...habitDate };
    for (const date in newHabitDate) {
      newHabitDate[date] = newHabitDate[date].map((h) =>
        h.id === id ? { ...h, name: value } : h,
      );
    }
    setHabitDate(newHabitDate);
  };

  // 페이지 이동
  // 현재 스터디 ID를 브라우저에 저장 -> Focus 페이지에서 사용하기 위함
  const goToFocusPage = () => {
    localStorage.setItem('currentStudyId', id);
    navigate('/today-focus');
  };
  // 현재 스터디 ID에 따른 페이지 이동
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

      {/* 습관 관리 모달 */}
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
