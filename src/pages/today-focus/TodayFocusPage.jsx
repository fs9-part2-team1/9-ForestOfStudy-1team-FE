import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./TodayFocusPage.module.css";
import MainLayout from "@/layouts/MainLayout";
import playIcon from "@/assets/icons/stopwatch/ic_play.png";
import pauseIcon from "@/assets/icons/stopwatch/ic_pause.png";
import restartIcon from "@/assets/icons/stopwatch/ic_restart.png";
import stopIcon from "@/assets/icons/stopwatch/ic_stop.png";
import clockIcon from "@/assets/icons/stopwatch/ic_clock.png";
import leaf from "@/assets/icons/common/ic_leaf.png";
import { CustomToast } from "@/components";

export default function TodayFocusPage() {
  const navigate = useNavigate();

  const goToHabit = () => navigate("/today-habit");
  const goToHome = () => navigate("/");

  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [started, setStarted] = useState(false);
  const [points, setPoints] = useState(310);


  const [rewardGiven, setRewardGiven] = useState(false);


  const [toast, setToast] = useState({ show: false, message: "", type: "warning" });
  const showToast = (message, type = "warning") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  //  타이머 작동
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  //  초과 감지
  useEffect(() => {
    
    if (timeLeft < 0 && !rewardGiven) {
      setIsOvertime(true);
      setPoints((prev) => prev + 50);
      setRewardGiven(true);
      showToast("🎉 50포인트를 획득했습니다!", "share");
    }
  }, [timeLeft, rewardGiven]);

  //  시간 포맷
  const formatTime = () => {
    const abs = Math.abs(timeLeft);
    const min = Math.floor(abs / 60).toString().padStart(2, "0");
    const sec = (abs % 60).toString().padStart(2, "0");
    return `${timeLeft < 0 ? "-" : ""}${min}:${sec}`;
  };

  // ▶ Start
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    setStarted(true);
  };

  //  Stop
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(true);
    showToast("🚨 집중이 중단되었습니다", "warning");
  };

  //  Stop 
  const handleOverStop = () => {
    if (!rewardGiven) {
      setPoints((prev) => prev + 50);
      showToast("🎉 50포인트를 획득했습니다!", "share");
      setRewardGiven(true);
    }
    handleRestart();
  };

  //  Restart
  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsOvertime(false);
    setTimeLeft(1 * 60);
    setStarted(false);
    setRewardGiven(false);
  };

  return (
    <MainLayout disabled>
      <div className={styles.page}>
        <div className={styles.container}>
          
         {/* HEADER */}
<div className={styles.header}>
  <div className={styles.headerTop}>
    <h1 className={styles.headerTitle}>연우의 개발공장</h1>
    <div className={styles.navBtns}>
      <button onClick={goToHabit} className={styles.navBtn}>
        오늘의 습관 &gt;
      </button>
      <button onClick={goToHome} className={styles.navBtn}>
        홈 &gt;
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

          {/* TIMER */}
          <div className={styles.timerBox}>
            <h2 className={styles.focusTitle}>오늘의 집중</h2>

            {(isRunning || isPaused || isOvertime) && (
              <div className={styles.timerFixed}>
                <img src={clockIcon} alt="clock" />
                <span>25:00</span>
              </div>
            )}

            <div
              className={`${styles.time} ${
                started ? styles.active : ""
              } ${isOvertime ? styles.overtime : ""}`}
            >
              {formatTime()}
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

        {/*  토스트 렌더링 */}
        <CustomToast show={toast.show} message={toast.message} type={toast.type} />
      </div>
    </MainLayout>
  );
}
