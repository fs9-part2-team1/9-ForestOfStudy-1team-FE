import MainLayout from '@/Layouts/MainLayout';
import styles from './MakeStudyPage.module.css';
import bgSelectIcon from '@/assets/icons/common/ic_bg_selected.png';
import visibilityOffIcon from '@/assets/icons/password/btn_visibility_off.png';
import visibilityOnIcon from '@/assets/icons/password/btn_visibility_on.png';

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studyAPI } from '@/api/studyAPI';
import {
  BACKGROUND,
  BACKGROUND_ENUM,
} from '../../features/home/StudyCard/backgroundImg';

export default function MakeStudyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState(BACKGROUND_ENUM.COLOR_GREEN);
  const [modifyMod, setModifyMod] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const passwordConfirmErrMsgRef = useRef(null);

  const resetForm = () => {
    setNickname('');
    setTitle('');
    setDescription('');
    setPassword('');
    setPasswordConfirm('');
    setBackground(BACKGROUND.COLOR_GREEN);
  };

  useEffect(() => {
    if (id) {
      setModifyMod(true);
      fetchStudyDetail(id);
    } else {
      setModifyMod(false);
      resetForm();
    }
  }, [id]);

  const fetchStudyDetail = async (id) => {
    try {
      const study = await studyAPI.getStudyById(id);
      setTitle(study.title);
      setNickname(study.nickname);
      setDescription(study.description);
      setBackground(study.background);
    } catch (error) {
      console.error('스터디 데이터 불러오기 실패:', error);
    }
  };

  // 비밀번호 표시 토글
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

  // 유효성 검사
  const checkValidateTitle = (paramTitle) => !!paramTitle.trim();
  const checkValidateNickname = (paramNickname) => !!paramNickname.trim();
  const checkValidatePassword = (paramPassword) => paramPassword.length >= 8;
  const checkValidatePasswordConfirm = (paramPassword, paramPasswordConfirm) =>
    paramPasswordConfirm.length > 0 && paramPassword === paramPasswordConfirm;

  // 입력 파트
  const onInputNickname = (e) => {
    const err = e.currentTarget.nextElementSibling;
    const temp = e.currentTarget.value;
    setNickname(temp);
    err.className = checkValidateNickname(temp)
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  const onInputTitle = (e) => {
    const err = e.currentTarget.nextElementSibling;
    const temp = e.currentTarget.value;
    setTitle(temp);
    err.className = checkValidateTitle(temp)
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  const onInputPassword = (e) => {
    const err = e.currentTarget.parentElement.nextElementSibling;
    const temp = e.currentTarget.value;
    const isValidate = checkValidatePassword(temp);
    const isConfirmValid = checkValidatePasswordConfirm(temp, passwordConfirm);
    setPassword(temp);

    // 비밀번호 검사
    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
    err.innerText =
      temp.length === 0
        ? '비밀번호를 입력해 주세요'
        : '비밀번호를 8자 이상 입력해주세요';

    passwordConfirmErrMsgRef.current.innerText = passwordConfirm
      ? '비밀번호가 일치하지 않습니다'
      : '비밀번호 확인을 입력해 주세요';
    passwordConfirmErrMsgRef.current.className = isConfirmValid
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  const onInputPasswordConfirm = (e) => {
    const err = e.currentTarget.parentElement.nextElementSibling;
    const temp = e.currentTarget.value;
    const isValidate = checkValidatePasswordConfirm(password, temp);
    setPasswordConfirm(temp);

    err.innerText = temp
      ? '비밀번호가 일치하지 않습니다'
      : '비밀번호 확인을 입력해 주세요';
    err.className = isValidate
      ? `${styles.inputErrMessage} ${styles.nonDisplay}`
      : `${styles.inputErrMessage}`;
  };

  const onInputDescription = (e) => setDescription(e.currentTarget.value);

  // 배경 선택
  const onClickBackground = (key) => setBackground(key);

  const onClickMakeButton = () => {
    const isValid =
      checkValidateTitle(title) &&
      checkValidateNickname(nickname) &&
      checkValidatePassword(password) &&
      checkValidatePasswordConfirm(password, passwordConfirm);

    if (isValid) {
      modifyMod ? handleUpdateStudy() : handleCreateStudy();
    } else {
      alert('입력값을 다시 확인해주세요.');
    }
  };

  // 새 스터디 만들기
  const handleCreateStudy = async () => {
    try {
      const data = { nickname, title, description, background, password };
      const newStudy = await studyAPI.createStudy(data);
      navigate(`/study-detail/${newStudy.id}`);
    } catch (error) {
      console.error('스터디 생성 실패:', error);
    }
  };

  // 기존 스터디 수정
  const handleUpdateStudy = async () => {
    try {
      const data = { title, description, background, password };
      await studyAPI.updateStudy(id, data);
      navigate(`/study-detail/${id}`);
    } catch (error) {
      console.error('스터디 수정 실패:', error);
    }
  };

  const backgroundList = [
    { key: 'COLOR_GREEN', value: BACKGROUND_ENUM.COLOR_GREEN, type: 'color' },
    { key: 'COLOR_ORANGE', value: BACKGROUND_ENUM.COLOR_ORANGE, type: 'color' },
    { key: 'COLOR_BLUE', value: BACKGROUND_ENUM.COLOR_BLUE, type: 'color' },
    { key: 'COLOR_PINK', value: BACKGROUND_ENUM.COLOR_PINK, type: 'color' },
    { key: 'IMAGE_1', value: BACKGROUND_ENUM.IMAGE_1, type: 'image' },
    { key: 'IMAGE_2', value: BACKGROUND_ENUM.IMAGE_2, type: 'image' },
    { key: 'IMAGE_3', value: BACKGROUND_ENUM.IMAGE_3, type: 'image' },
    { key: 'IMAGE_4', value: BACKGROUND_ENUM.IMAGE_4, type: 'image' },
  ];

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
            {backgroundList.map((bg) => (
              <li
                className={styles.backgroundItem}
                key={bg.key}
                onClick={() => onClickBackground(bg.value)}
                style={
                  bg.type === 'color'
                    ? { backgroundColor: BACKGROUND[bg.value] }
                    : {
                        backgroundImage: `url(${BACKGROUND[bg.value]})`,
                        backgroundSize: 'cover',
                      }
                }
              >
                {background === bg.value && (
                  <img
                    className={styles.bgSelectIcon}
                    src={background === bg.value ? bgSelectIcon : null}
                    alt="선택됨"
                  />
                )}
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
