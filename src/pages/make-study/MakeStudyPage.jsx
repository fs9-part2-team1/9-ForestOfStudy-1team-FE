/**
 *
 *  Mission TeamProject
 *
 *  2025. 10. 13
 *
 *  make-study page
 *
 *  MakeStudyPage.jsx
 *
 *  author: ys
 *
 */

import MainLayout from '@/Layouts/MainLayout';
import styles from './MakeStudyPage.module.css';
import visibilityOffIcon from '@/assets/icons/password/btn_visibility_off.png';
import visibilityOnIcon from '@/assets/icons/password/btn_visibility_on.png';
import alvaroThumbnail from '@/assets/images/thumbnail/alvaro-reyes-unsplash.png';
import andrewThumbnail from '@/assets/images/thumbnail/andrew-ridley-unsplash.png';
import chrisThumbnail from '@/assets/images/thumbnail/chris-lee-unsplash.png';
import mikeyThumbnail from '@/assets/images/thumbnail/mikey-harris-unsplash.png';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

/* 배경 이미지 썸네일 리스트 */
const backgroundList = [
  { id: uuid(), type: 'bg', value: 'var(--card--green)' },
  { id: uuid(), type: 'bg', value: 'var(--card--yellow)' },
  { id: uuid(), type: 'bg', value: 'var(--card--blue)' },
  { id: uuid(), type: 'bg', value: 'var(--card--pink)' },
  { id: uuid(), type: 'img', value: mikeyThumbnail },
  { id: uuid(), type: 'img', value: chrisThumbnail },
  { id: uuid(), type: 'img', value: andrewThumbnail },
  { id: uuid(), type: 'img', value: alvaroThumbnail },
];

export default function MakeStudyPage() {
  let id;
  let title;
  let nickname;
  let password;
  let passwordConfirm;
  let description;
  let background;

  /* 비밀 번호 입력란 보여주기 기능 토글 */
  const passwordVisibleToggle = (event) => {
    const inputPassword = event.currentTarget.previousElementSibling;

    if (event.currentTarget.classList.contains('invisibled')) {
      inputPassword.type = 'text';
      event.currentTarget.classList.remove('invisibled');
      event.currentTarget.src = visibilityOnIcon;
    } else {
      inputPassword.type = 'password';
      event.currentTarget.classList.add('invisibled');
      event.currentTarget.src = visibilityOffIcon;
    }
  };

  /* 스터디 제목 입련란 유효성 검사 */
  const validateTitle = (event) => {
    const err = event.currentTarget.nextElementSibling;
    title = event.currentTarget.value;
    const isValidate = title ? true : false;

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
    console.log('[validateTitle] title: ', title);
    console.log('[validateTitle] err: ', err.className);
    return isValidate;
  };

  /* 닉네임 입력란 유효성 검사 */
  const validateNickname = (event) => {
    const err = event.currentTarget.nextElementSibling;

    nickname = event.currentTarget.value;
    const isValidate = nickname ? true : false;

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;

    console.log('[validateNickname] nicname: ', nickname);
    return isValidate;
  };

  /* 비밀번호 입력란 유효성 검사 */
  const validatePassword = (event) => {
    const err = event.currentTarget.parentElement.nextElementSibling;
    password = event.currentTarget.value;
    const isValidate = password.length > 8;

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;

    err.innerText =
      password.length === 0
        ? '비밀번호를 입력해 주세요'
        : '비밀번호를 8자 이상 입력해주세요';

    err.className =
      password === passwordConfirm
        ? `${styles.inputErrMessage} ${styles.nonDisplay}`
        : `${styles.inputErrMessage}`;

    console.log('[validatePassword] password: ', password);
    console.log('[validatePasswordConfirm] err: ', err);

    return isValidate;
  };

  /* 비밀번호 확인 입력란 유효성 검사 */
  const validatePasswordConfirm = (event) => {
    const err = event.currentTarget.parentElement.nextElementSibling;
    passwordConfirm = event.currentTarget.value;

    const isValidate =
      passwordConfirm.length !== 0 && password === passwordConfirm;

    err.innerText = passwordConfirm
      ? '비밀번호가 일치하지 않습니다'
      : '비밀번호 확인을 입력해 주세요';

    err.className =
      password === passwordConfirm
        ? `${styles.inputErrMessage} ${styles.nonDisplay}`
        : `${styles.inputErrMessage}`;

    console.log('[validatePasswordConfirm] passwordConfirm: ', passwordConfirm);
    console.log('[validatePasswordConfirm] err: ', err);

    return isValidate;
  };

  /* 스터디 소개란 이벤트 */
  const onInputDescription = (event) => {
    description = event.currentTarget.value;
    console.log('[validateDescription] description: ', description);
  };

  /* 배경 화면 이벤트 */
  const onClickBackground = (event, bg) => {
    id = bg.id;
    background = bg;
    console.log('[validateBackground] background: ', background);
    console.log(
      '[validateBackground] event.currentTarget: ',
      event.currentTarget,
    );
    console.log(
      '[validateBackground] event.currentTarget.key: ',
      event.currentTarget.key,
    );
  };

  /* api 서버로 requset 요청 - post */
  const handleRequsetPost = (event) => {
    const url = '/study';
    const study = {
      id,
      nickname,
      title,
      description,
      background,
      password,
    };

    console.log('[handleRequestPost] study: ', study);

    axios
      .post(url, study)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(`[${error.code} - ${error.status}] ${error.message} `);
      });
  };

  return (
    <MainLayout>
      <div className={styles.appContainer}>
        <h1 className={styles.title}>스터디 만들기</h1>
        <div className={styles.inputContainer}>
          <div className={styles.inputText}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              name="nickname"
              onInput={validateNickname}
              onBlur={validateTitle}
              placeholder="닉네임을 입력해 주세요"
            />
            <span className={`${styles.inputErrMessage} ${styles.nonDisplay}`}>
              * 닉네임을 입력해 주세요
            </span>
          </div>
          <div className={styles.inputText}>
            <label htmlFor="studyname">스터디 이름</label>
            <input
              type="text"
              name="studyname"
              onInput={validateTitle}
              onBlur={validateTitle}
              placeholder="스터디 이름을 입력해 주세요"
            />
            <span className={`${styles.inputErrMessage} ${styles.nonDisplay}`}>
              * 스터디 이름을 입력해 주세요
            </span>
          </div>
          <div className={styles.textArea}>
            <label htmlFor="introduce">소개</label>
            <textarea
              name="introduce"
              placeholder="소개 멘트를 작성해 주세요"
              onInput={onInputDescription}
            />
          </div>
        </div>
        <div className={styles.backgroundListContainer}>
          <span>배경을 선택해 주세요</span>
          <ul className={styles.backgroundList}>
            {backgroundList.map((bg, index) => (
              <li
                className={styles.backgroundItem}
                key={bg.id}
                onClick={(event) => onClickBackground(event, bg)}
                style={
                  bg.type === 'bg'
                    ? { backgroundColor: bg.value }
                    : { backgroundImage: `url(${bg.value})` }
                }
              ></li>
            ))}
          </ul>
        </div>
        <div className={styles.inputPasswordContainer}>
          <div className={styles.inputPassword}>
            <label htmlFor="password">비밀번호</label>
            <div className={styles.passwordWrap}>
              <input
                type="password"
                name="password"
                onInput={validatePassword}
                onBlur={validatePassword}
                placeholder="비밀번호를 입력해 주세요"
              ></input>
              <img
                className={`${styles.passwordToggleButton} invisibled`}
                src={visibilityOffIcon}
                onClick={(event) => passwordVisibleToggle(event)}
              />
            </div>
            <span className={`${styles.inputErrMessage} ${styles.nonDisplay}`}>
              * 비밀번호를 입력해 주세요
            </span>
          </div>
          <div className={styles.inputPassword}>
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <div className={styles.passwordWrap}>
              <input
                type="password"
                name="passwordConfirm"
                onInput={validatePasswordConfirm}
                onBlur={validatePasswordConfirm}
                placeholder="비밀번호를 다시 한 번 입력해 주세요"
              />
              <img
                className={styles.passwordToggleButton}
                src={visibilityOffIcon}
                onClick={(event) => passwordVisibleToggle(event)}
              />
            </div>
            <span className={`${styles.inputErrMessage} ${styles.nonDisplay}`}>
              * 비밀번호가 일치하지 않습니다
            </span>
          </div>
        </div>
        <button className={styles.makeButton} onClick={handleRequsetPost}>
          만들기
        </button>
      </div>
    </MainLayout>
  );
}
