import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import styles from './TodayFocusPage.module.css';
import MainLayout from '@/layouts/MainLayout';
import playIcon from '@/assets/icons/stopwatch/ic_play.png';
import pauseIcon from '@/assets/icons/stopwatch/ic_pause.png';
import restartIcon from '@/assets/icons/stopwatch/ic_restart.png';
import stopIcon from '@/assets/icons/stopwatch/ic_stop.png';
import clockIcon from '@/assets/icons/stopwatch/ic_clock.png';
import leaf from '@/assets/icons/common/ic_leaf.png';
import { Container, CustomToast } from '@/components';
import arrowRightIcon from '@/assets/icons/common/ic_arrow_right.png';
import { studyAPI } from '@/api/studyAPI';

export default function TodayFocusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 관리
  const [study, setStudy] = useState(null);
  const [points, setPoints] = useState(0); // 현재 스터디의 획득 포인트
  const [rewardGiven, setRewardGiven] = useState(false); // 카운트 완료 포인트 추가

  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(customMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [started, setStarted] = useState(false);
  const [editing, setEditing] = useState(false); // 수정 모드 상태
  const [inputValue, setInputValue] = useState(customMinutes.toString());
  const [loading, setLoading] = useState(true);

  // 토스트
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'warning',
  });

  const showToast = (message, type = 'warning') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2000);
  };

  // 서버에서 스터디 데이터 받아오기
  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const data = await studyAPI.getStudyById(id);
        setStudy(data);
        setPoints(data.points ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudy();
  }, [id]);

  // 스터디에 포인트 추가
  const addPoints = useCallback(
    async (value) => {
      if (!study) return;
      setPoints((prev) => prev + value);
      try {
        const updated = await studyAPI.updateStudy(id, {
          points: points + value,
        });
        setStudy((prev) => ({ ...prev, points: updated.points }));
      } catch (err) {
        console.error(err);
        setPoints((prev) => prev - value);
      }
    },
    [id, points, study],
  );

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

  // 페이지 이동
  const goToHabit = () => navigate(`/today-habit/${id}`);
  const goToHome = () => navigate(`/study-detail/${id}`);

  if (loading) {
    return (
      <MainLayout disabled>
        <Container>
          <p>스터디 데이터를 불러오는 중...</p>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout disabled>
      <div className={styles.page}>
        <div className={styles.container}>
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
                {points ?? study?.points ?? 0}P 획득
              </div>
            </div>
          </div>

          <div className={styles.timerBox}>
            <h2 className={styles.focusTitle}>오늘의 집중</h2>

            {(isRunning || isPaused || isOvertime) && (
              <div className={styles.timerFixed}>
                <img src={clockIcon} alt="clock" />
                <span>{customMinutes.toString().padStart(2, '0')}:00</span>
              </div>
            )}

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

            <div className={styles.buttonContainer}>
              {!started && (
                <button onClick={handleStart} className={styles.startBtn}>
                  <img src={playIcon} alt="play" />
                  <span>Start!</span>
                </button>
              )}

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

        <CustomToast
          show={toast.show}
          message={toast.message}
          type={toast.type}
        />
      </div>
    </MainLayout>
  );
}
