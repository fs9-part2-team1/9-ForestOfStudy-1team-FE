import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styles from "./TodayFocusPage.module.css";
import MainLayout from "@/layouts/MainLayout";
import playIcon from "@/assets/icons/stopwatch/ic_play.png";
import pauseIcon from "@/assets/icons/stopwatch/ic_pause.png";
import restartIcon from "@/assets/icons/stopwatch/ic_restart.png";
import stopIcon from "@/assets/icons/stopwatch/ic_stop.png";
import clockIcon from "@/assets/icons/stopwatch/ic_clock.png";

export default function TodayFocusPage() {
  const navigate = useNavigate(); // ✅ 추가

  const goToHabit = () => {
    navigate("/today-habit"); // ✅ 실제 라우트 경로에 맞게 수정
  };

  const goToHome = () => {
    navigate("/"); // ✅ 홈으로 이동
  };

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);

  // ⏱ 타이머 작동
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // ⏳ 초과 감지
  useEffect(() => {
    setIsOvertime(timeLeft < 0);
  }, [timeLeft]);

  const formatTime = () => {
    const abs = Math.abs(timeLeft);
    const min = Math.floor(abs / 60).toString().padStart(2, "0");
    const sec = (abs % 60).toString().padStart(2, "0");
    return `${timeLeft < 0 ? "-" : ""}${min}:${sec}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsOvertime(false);
    setTimeLeft(25 * 60);
  };

  return (
    <MainLayout disabled>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <h1>연우의 개발공장</h1>
              <div className={styles.navBtns}>
                <button onClick={goToHabit} className={styles.navBtn}>
                  오늘의 습관 &gt;
                </button>
                <button onClick={goToHome} className={styles.navBtn}>
                  홈 &gt;
                </button>
              </div>
            </div>
            

            <div className={styles.subInfo}>
              <div className={styles.pointInfo}>
                <div>현재까지 획득한 포인트</div>
                <div className={styles.point}>310P 획득</div>
              </div>
            </div>
          </div>
          {/* TIMER */}
          <div className={styles.timerBox}>
            <h2 className={styles.focusTitle}>오늘의 집중</h2>
            <div className={styles.timerFixed}>
              <img src={clockIcon} alt="clock" />
              <span>25:00</span>
            </div>

            {/* 타이머 숫자 */}
            <div
              className={`${styles.time} ${
                isRunning ? styles.active : ""
              } ${isOvertime ? styles.overtime : ""}`}
            >
              {formatTime()}
            </div>

            {/* 버튼 영역 */}
            <div className={styles.buttonContainer}>
              {/* 기본 상태 */}
              {!isRunning && !isPaused && !isOvertime && (
                <button onClick={handleStart} className={styles.startBtn}>
                  <img src={playIcon} alt="play" />
                  <span>Start!</span>
                </button>
              )}

              {/* 작동 중: Stop + Start + Restart */}
              {isRunning && !isOvertime && (
                <>
                  <button onClick={handleStop} className={styles.pauseIconBtn}>
                    <img src={pauseIcon} alt="pause" />
                  </button>
                  <button
                    onClick={handleStart}
                    className={`${styles.startBtn} ${isRunning ? styles.running : ""}`}
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

              {/* 초과 상태: Stop(ic_stop.png) + Restart */}
              {isOvertime && (
                <>
                  <button onClick={handleStop} className={styles.pauseIconBtn}>
                    <img src={stopIcon} alt="stop" />
                  </button>
                  <button
                    onClick={handleRestart}
                    className={styles.restartIconBtn}
                  >
                    <img src={restartIcon} alt="restart" />
                  </button>
                </>
              )}

              {/* 일시정지: Start + Restart */}
              {isPaused && !isRunning && !isOvertime && (
                <>
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
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
