import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './TodayFocusPage.module.css';
import MainLayout from '@/layouts/MainLayout';
import playIcon from '@/assets/icons/stopwatch/ic_play.png';
import pauseIcon from '@/assets/icons/stopwatch/ic_pause.png';
import restartIcon from '@/assets/icons/stopwatch/ic_restart.png';
import stopIcon from '@/assets/icons/stopwatch/ic_stop.png';
import clockIcon from '@/assets/icons/stopwatch/ic_clock.png';
import leaf from '@/assets/icons/common/ic_leaf.png';
import { CustomToast } from '@/components';
import arrowRightIcon from '@/assets/icons/common/ic_arrow_right.png';
import { mockData } from '@/data/mock-data';

export default function TodayFocusPage() {
  // 현재 스터디 선택 : 로컬 스토리지에 저장된 스터디 ID 가져오기
  const storedId = localStorage.getItem('currentStudyId');
  const studyId = storedId;

  // 해당 스터디 Id 데이터 찾기(항상 최신 ID 기준) -> 포인트 반영을 위함
  const study = mockData.find((s) => s.id === studyId);

  // 포인트 관리 : 각 스터디별 포인트를 로컬 스토리지에서 불러옴, 없으면 기본 포인트 사용
  const getStoredPoints = () => {
    const stored = JSON.parse(localStorage.getItem('studyPoints') || '{}');
    return stored[studyId] ?? study.points;
  };

  // 포인트 추가 함수
  const addPoints = useCallback(
    (value) => {
      const stored = JSON.parse(localStorage.getItem('studyPoints') || '{}');
      const prev = stored[studyId] ?? study.points;
      stored[studyId] = prev + value;
      localStorage.setItem('studyPoints', JSON.stringify(stored));
      setPoints(stored[studyId]);
    },
    [studyId, study.points], // studyId에 의존
  );

  // 페이지 이동
  const navigate = useNavigate();
  // 로컬 스토리지에 저장된 스터디 ID를 사용해서 이동
  const goToHabit = () => {
    const studyId = localStorage.getItem('currentStudyId');
    navigate(`/today-habit/${studyId}`);
  };
  const goToHome = () => {
    const studyId = localStorage.getItem('currentStudyId');
    navigate(`/study-detail/${studyId}`);
  };

  // 상태 관리
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [started, setStarted] = useState(false);
  const [editing, setEditing] = useState(false); // ← 수정 모드 상태
  const [inputValue, setInputValue] = useState(customMinutes.toString());
  const [points, setPoints] = useState(getStoredPoints());
  const [rewardGiven, setRewardGiven] = useState(false);

  // 토스트 상태
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'warning',
  });

  const showToast = (message, type = 'warning') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2000);
  };

  // 타이머 동작
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // 초과 시간 감지
  useEffect(() => {
    if (timeLeft < 0 && !rewardGiven) {
      setIsOvertime(true);
      addPoints(50);
      setRewardGiven(true);
      showToast('🎉 50포인트를 획득했습니다!', 'share');
    }
  }, [timeLeft, rewardGiven, addPoints]);

  // 시간 포맷
  const formatTime = () => {
    const abs = Math.abs(timeLeft);
    const min = Math.floor(abs / 60)
      .toString()
      .padStart(2, '0');
    const sec = (abs % 60).toString().padStart(2, '0');
    return `${timeLeft < 0 ? '-' : ''}${min}:${sec}`;
  };

  // Start
  const handleStart = () => {
    if (customMinutes <= 0) {
      showToast('⏱️ 1분 이상 입력하세요', 'warning');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    setStarted(true);
  };

  // Stop
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(true);
    showToast('🚨 집중이 중단되었습니다', 'warning');
  };

  // 초과 Stop
  const handleOverStop = () => {
    if (!rewardGiven) {
      setPoints((prev) => prev + 50);
      showToast('🎉 50포인트를 획득했습니다!', 'share');
      setRewardGiven(true);
    }
    handleRestart();
  };

  // Restart
  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsOvertime(false);
    setTimeLeft(customMinutes * 60);
    setStarted(false);
    setRewardGiven(false);
  };

  // 타이머 시간 수정(클릭 시)
  const handleEditClick = () => {
    if (started || isRunning) return; // 실행 중엔 수정 불가
    setEditing(true);
    setInputValue(customMinutes.toString());
  };

  // 입력값 변경
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 수정 완료
  const handleInputSubmit = () => {
    const newMinutes = Number(inputValue);
    if (isNaN(newMinutes) || newMinutes <= 0) {
      showToast('⏱️ 유효한 숫자를 입력하세요', 'warning');
      setEditing(false);
      return;
    }
    setCustomMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
    setEditing(false);
    setIsRunning(false);
    setIsPaused(false);
    setIsOvertime(false);
    setStarted(false);
  };

  return (
    <MainLayout disabled>
      <div className={styles.page}>
        <div className={styles.container}>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h1 className={styles.headerTitle}>
                {study.nickname}의 {study.title}
              </h1>
              <div className={styles.navBtns}>
                <button onClick={goToHabit} className={styles.navBtn}>
                  오늘의 습관
                  <img
                    src={arrowRightIcon}
                    alt="화살표"
                    className={styles.arrowIcon}
                  />
                </button>
                <button onClick={goToHome} className={styles.navBtn}>
                  홈
                  <img
                    src={arrowRightIcon}
                    alt="화살표"
                    className={styles.arrowIcon}
                  />
                </button>
              </div>
            </div>

            <div className={styles.getPoint}>
              <h2 className={styles.title}>현재까지 획득한 포인트</h2>
              <div className={styles.pointBox}>
                <img className={styles.leaf} src={leaf} alt="획득 포인트" />
                {points}P 획득
              </div>
            </div>
          </div>

          {/* 타이머 */}
          <div className={styles.timerBox}>
            <h2 className={styles.focusTitle}>오늘의 집중</h2>

            {(isRunning || isPaused || isOvertime) && (
              <div className={styles.timerFixed}>
                <img src={clockIcon} alt="clock" />
                <span>{customMinutes.toString().padStart(2, '0')}:00</span>
              </div>
            )}

            {/*타이머 표시*/}
            <div
              className={`${styles.time} ${started ? styles.active : ''} ${
                isOvertime ? styles.overtime : ''
              }`}
            >
              {editing ? (
                <input
                  type="number"
                  className={styles.timeInput}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  autoFocus
                />
              ) : (
                <span onClick={handleEditClick}>{formatTime()}</span>
              )}
            </div>

            {/* 버튼들 */}
            <div className={styles.buttonContainer}>
              {!started && (
                <button onClick={handleStart} className={styles.startBtn}>
                  <img src={playIcon} alt="play" />
                  <span>Start!</span>
                </button>
              )}

              {/* 작동 중 */}
              {isRunning && !isOvertime && (
                <>
                  <button onClick={handleStop} className={styles.pauseIconBtn}>
                    <img src={pauseIcon} alt="pause" />
                  </button>
                  <button
                    onClick={handleStart}
                    className={`${styles.startBtn} ${styles.running}`}
                  >
                    <img src={playIcon} alt="play" />
                    <span>Start!</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className={styles.restartIconBtn}
                  >
                    <img src={restartIcon} alt="restart" />
                  </button>
                </>
              )}

              {/* 일시정지 */}
              {isPaused && !isRunning && !isOvertime && (
                <>
                  <button onClick={handleStop} className={styles.pauseIconBtn}>
                    <img src={pauseIcon} alt="pause" />
                  </button>
                  <button onClick={handleStart} className={styles.startBtn}>
                    <img src={playIcon} alt="play" />
                    <span>Start!</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className={styles.restartIconBtn}
                  >
                    <img src={restartIcon} alt="restart" />
                  </button>
                </>
              )}

              {/* 초과 상태 */}
              {isOvertime && (
                <div className={styles.overtimeButtons}>
                  <button onClick={handleOverStop} className={styles.stopBtn}>
                    <img src={stopIcon} alt="stop" />
                    <span>Stop!</span>
                  </button>
                  <button
                    onClick={handleRestart}
                    className={styles.restartIconBtn}
                  >
                    <img src={restartIcon} alt="restart" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 토스트 */}
        <CustomToast
          show={toast.show}
          message={toast.message}
          type={toast.type}
        />
      </div>
    </MainLayout>
  );
}
