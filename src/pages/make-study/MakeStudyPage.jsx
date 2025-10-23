import MainLayout from '@/Layouts/MainLayout';
import styles from './MakeStudyPage.module.css';
import bgSelectIcon from '@/assets/icons/common/ic_bg_selected.png';
import visibilityOffIcon from '@/assets/icons/password/btn_visibility_off.png';
import visibilityOnIcon from '@/assets/icons/password/btn_visibility_on.png';
import deskThumb from '@/assets/images/thumbnail/img_desk_thumbnail.png';
import plantThumb from '@/assets/images/thumbnail/img_plant_thumbnail.png';
import wallThumb from '@/assets/images/thumbnail/img_wall_thumbnail.png';
import windowThumb from '@/assets/images/thumbnail/img_window_thumbnail.png';
import deskImage from '@/assets/images/background/img_desk.jpg';
import plantImage from '@/assets/images/background/img_plant.jpg';
import wallImage from '@/assets/images/background/img_wall.jpg';
import windowImage from '@/assets/images/background/img_window.jpg';
import mockItems from '@/data/mock-study-list';

import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

/* 배경 이미지 썸네일 리스트 */
const backgroundList = [
  {
    id: uuid(),
    type: 'bg',
    value: 'var(--card--green)',
    image: 'var(--card--green)',
  },
  {
    id: uuid(),
    type: 'bg',
    value: 'var(--card--yellow)',
    image: 'var(--card--yellow)',
  },
  {
    id: uuid(),
    type: 'bg',
    value: 'var(--card--blue)',
    image: 'var(--card--blue)',
  },
  {
    id: uuid(),
    type: 'bg',
    value: 'var(--card--pink)',
    image: 'var(--card--pink)',
  },
  { id: uuid(), type: 'img', value: deskThumb, image: deskImage },
  { id: uuid(), type: 'img', value: plantThumb, image: plantImage },
  { id: uuid(), type: 'img', value: wallThumb, image: wallImage },
  { id: uuid(), type: 'img', value: windowThumb, image: windowImage },
];

export default function MakeStudyPage() {
  let [id, setId] = useState(useParams().id);
  let [title, setTitle] = useState('');
  let [nickname, setNickname] = useState('');
  let [password, setPassword] = useState('');
  let [passwordConfirm, setPasswordConfirm] = useState('');
  let [description, setDescription] = useState('');
  let [background, setBackground] = useState({ ...backgroundList[0] });
  let [modifyMod, setModifyMod] = useState(false);
  let prevBackgroundElement;

  const passwordConfirmErrMsgRef = useRef(null);

  useEffect(() => {
    const tempModifyMod = id !== undefined;
    const study = id ? handleRequestGet(id) : {};

    tempModifyMod ? setModifyMod(tempModifyMod) : setModifyMod(tempModifyMod);

    // 수정 모드 진행
    if (tempModifyMod) {
      setTitle(study?.title);
      setNickname(study?.nickname);
      setDescription(study?.description);
      setBackground(study?.background);
    }
  }, []);

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
  const checkValidateTitle = (paramTitle) => {
    return paramTitle ? true : false;
  };

  /* 닉네임 입력란 유효성 검사 */
  const checkValidateNickname = (paramNickname) => {
    return paramNickname ? true : false;
  };

  /* 비밀번호 입력란 유효성 검사 */
  const checkValidatePassword = (paramPassword) => {
    const VALIDATE_LENGTH = 8;
    return paramPassword.length >= VALIDATE_LENGTH;
  };

  /* 비밀번호 확인 입력란 유효성 검사 */
  const checkValidatePasswordConfirm = (
    paramPassword,
    paramPasswordConfirm,
  ) => {
    return (
      paramPasswordConfirm?.length !== 0 &&
      paramPassword === paramPasswordConfirm
    );
  };

  /* 닉네임 입력란 이벤트 핸들 */
  const onInputNickname = (event) => {
    const err = event.currentTarget.nextElementSibling;
    const tempNickname = event.currentTarget.value;
    setNickname(tempNickname);

    const isValidate = checkValidateNickname(tempNickname);

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  /* 스터디 제목 입력란 이벤트 핸들 */
  const onInputTitle = (event) => {
    const err = event.currentTarget.nextElementSibling;
    const tempTitle = event.currentTarget.value;

    setTitle(tempTitle);

    const isValidate = checkValidateTitle(tempTitle);

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  /* 비밀번호 입력란 이벤트 핸들 */
  const onInputPassword = (event) => {
    const err = event.currentTarget.parentElement.nextElementSibling;
    const tempPassword = event.currentTarget.value;
    const isValidate = checkValidatePassword(tempPassword);
    const isValidatePasswordConfirm = checkValidatePasswordConfirm(
      tempPassword,
      passwordConfirm,
    );

    setPassword(tempPassword);

    // 비밀번호 입력란 에러 메시지 토글
    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;

    err.innerText =
      password.length === 0
        ? '비밀번호를 입력해 주세요'
        : '비밀번호를 8자 이상 입력해주세요';

    // 비밀번호 입력 확인란 에러 메시지
    passwordConfirmErrMsgRef.current.innerText = passwordConfirm
      ? '비밀번호가 일치하지 않습니다'
      : '비밀번호 확인을 입력해 주세요';

    passwordConfirmErrMsgRef.current.className = isValidatePasswordConfirm
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  /* 비밀번호 확인 입력란 이벤트 핸들 */
  const onInputPasswordConfirm = (event) => {
    const err = event.currentTarget.parentElement.nextElementSibling;
    const tempPasswordConfirm = event.currentTarget.value;
    const isValidate = checkValidatePasswordConfirm(
      password,
      tempPasswordConfirm,
    );

    setPasswordConfirm(tempPasswordConfirm);

    err.innerText = tempPasswordConfirm
      ? '비밀번호가 일치하지 않습니다'
      : '비밀번호 확인을 입력해 주세요';

    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  /* 스터디 소개란 이벤트 핸들 */
  const onInputDescription = (event) => {
    setDescription(event.currentTarget.value);
  };

  /* 배경 화면 리스트 선택 이벤트 */
  const onClickBackground = (event, paramBackground) => {
    console.log('onClickBackground: ', paramBackground);
    background = {
      type: paramBackground.type,
      value: paramBackground.value,
      image: paramBackground.imgae,
    };

    if (!prevBackgroundElement) {
      prevBackgroundElement =
        event.currentTarget.parentElement.firstElementChild.firstElementChild;
    }

    prevBackgroundElement.src = '';
    event.currentTarget.firstElementChild.src = bgSelectIcon;
    prevBackgroundElement = event.currentTarget.firstElementChild;
  };

  /* 만들기 버튼 클릭 이벤트 함수 */
  const onClickMakeButton = () => {
    checkTotalValidate();
  };

  /* 모든 입력창 유효성 검사 함수 */
  const checkTotalValidate = () => {
    const isValidateTitle = checkValidateTitle(title);
    const isValidateNickname = checkValidateNickname(nickname);
    const isValidatePassword = checkValidatePassword(password);
    const isValidatePasswordConfirm = checkValidatePasswordConfirm(
      password,
      passwordConfirm,
    );

    if (
      isValidateTitle &&
      isValidateNickname &&
      isValidatePassword &&
      isValidatePasswordConfirm
    ) {
      handleRequsetPost();

      window.location.href = '/study-detail';
    }
  };

  /* api 서버로 requset 요청 - post */
  const handleRequsetPost = () => {
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

  /* 원래 database 에서 불러와야 하지만 현재 임시 mock 데이터를 불러옴 */
  const handleRequestGet = (id) => {
    const url = `/study/${id}`;
    const studyList = JSON.parse(JSON.stringify(mockItems));

    const study = axios
      .get(url)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(`[${error.code} - ${error.status}] ${error.message}`);
      });

    return studyList[id - 1];
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
              onInput={onInputNickname}
              onBlur={onInputNickname}
              value={nickname}
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
              onInput={onInputTitle}
              // onBlur={onInputTitle}
              value={title}
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
              value={description}
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
              >
                <img
                  className={styles.bgSelectIcon}
                  src={index === 0 ? bgSelectIcon : null}
                />
              </li>
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
                onInput={onInputPassword}
                onBlur={onInputPassword}
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
                onInput={onInputPasswordConfirm}
                onBlur={onInputPasswordConfirm}
                placeholder="비밀번호를 다시 한 번 입력해 주세요"
              />
              <img
                className={styles.passwordToggleButton}
                src={visibilityOffIcon}
                onClick={(event) => passwordVisibleToggle(event)}
              />
            </div>
            <span
              className={`${styles.inputErrMessage} ${styles.nonDisplay}`}
              ref={passwordConfirmErrMsgRef}
            >
              * 비밀번호가 일치하지 않습니다
            </span>
          </div>
        </div>
        <button className={styles.makeButton} onClick={onClickMakeButton}>
          {modifyMod ? '수정하기' : '만들기'}
        </button>
      </div>
    </MainLayout>
  );
}
