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
import style from './MakeStudyPage.module.css';
import visibilityOffIcon from '@/assets/icons/password/btn_visibility_off.png';
import visibilityOnIcon from '@/assets/icons/password/btn_visibility_on.png';
import alvaroThumbnail from '@/assets/images/thumbnail/alvaro-reyes-unsplash.png';
import andrewThumbnail from '@/assets/images/thumbnail/andrew-ridley-unsplash.png';
import chrisThumbnail from '@/assets/images/thumbnail/chris-lee-unsplash.png';
import mikeyThumbnail from '@/assets/images/thumbnail/mikey-harris-unsplash.png';

export default function MakeStudyPage() {
  const backgroundList = [
    { type: 'bg', value: 'var(--card--green)' },
    { type: 'bg', value: 'var(--card--yellow)' },
    { type: 'bg', value: 'var(--card--blue)' },
    { type: 'bg', value: 'var(--card--pink)' },
    { type: 'img', value: mikeyThumbnail },
    { type: 'img', value: chrisThumbnail },
    { type: 'img', value: andrewThumbnail },
    { type: 'img', value: alvaroThumbnail },
  ];

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

  const validateNickname = (value) => {};

  /* 비밀번호 입력란 유효성 검사 함수 */
  const validatePassword = (newPasswordConfirm) => {
    console.log('[validatePassword]newPasswordConfirm: ', newPasswordConfirm);
    return newPasswordConfirm.length > 8;
  };

  /* 비밀번호 확인 입력란 유효성 검사 함수 */
  const validatePasswordConfirm = () => {};

  /* api 서버로 requset 요청 - post */
  const handleRequsetPost = () => {};

  return (
    <MainLayout>
      <div className={style.appContainer}>
        <h1 className={style.title}>스터디 만들기</h1>
        <div className={style.inputContainer}>
          <div className={style.inputText}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="닉네임을 입력해 주세요"
            />
            <span className={style.inputErrMessage}>
              * 닉네임을 입력해 주세요
            </span>
          </div>
          <div className={style.inputText}>
            <label htmlFor="studyname">스터디 이름</label>
            <input
              type="text"
              name="studyname"
              placeholder="스터디 이름을 입력해 주세요"
            />
            <span className={style.inputErrMessage}>
              * 스터디 이름을 입력해 주세요
            </span>
          </div>
          <div className={style.textArea}>
            <label htmlFor="introduce">소개</label>
            <textarea
              name="introduce"
              placeholder="소개 멘트를 작성해 주세요"
            ></textarea>
          </div>
        </div>
        <div className={style.backgroundListContainer}>
          <span>배경을 선택해 주세요</span>
          <ul className={style.backgroundList}>
            {backgroundList.map((bg, index) => (
              <li
                className={style.backgroundItem}
                key={index}
                style={
                  bg.type === 'bg'
                    ? { backgroundColor: bg.value }
                    : { backgroundImage: `url(${bg.value})` }
                }
              ></li>
            ))}
          </ul>
        </div>
        <div className={style.inputPasswordContainer}>
          <div className={style.inputPassword}>
            <label htmlFor="password">비밀번호</label>
            <div className={style.passwordWrap}>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력해 주세요"
              ></input>
              <img
                className={`${style.passwordToggleButton} invisibled`}
                src={visibilityOffIcon}
                onClick={(event) => passwordVisibleToggle(event)}
              />
            </div>
            <span className={style.inputErrMessage}>
              * 비밀번호를 입력해 주세요
            </span>
          </div>
          <div className={style.inputPassword}>
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <div className={style.passwordWrap}>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호를 다시 한 번 입력해 주세요"
              />
              <img
                className={style.passwordToggleButton}
                src={visibilityOnIcon}
              />
            </div>
            <span className={style.inputErrMessage}>
              * 비밀번호가 일치하지 않습니다
            </span>
          </div>
        </div>
        <button className={style.makeButton}>만들기</button>
      </div>
    </MainLayout>
  );
}
