import React, { useState, useEffect } from 'react';
import StudyCard from './components/StudyCard';
import styles from './HomePage.module.css';
import mockItems from './api-data/mock-data-sh.js';

function AllStudySection() {
  const ITEMS_LIMIT = 6;

  const [studyList, setStudyList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_LIMIT);
  const [orderBy, setOrderBy] = useState('latest');

  const sortOptionList = [
    { value: 'latest', label: '새로운 순' },
    { value: 'oldest', label: '오래된 순' },
    { value: 'highest', label: '많은 포인트 순' },
    { value: 'lowest', label: '적은 포인트 순' },
  ];

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // 'Enter' key를 누르면 'keyword' -> 'searchTerm'으로 적용, Page는 처음으로
      setSearchTerm(keyword);
      setVisibleCount(ITEMS_LIMIT);
    }
  };

  const ControlMenu = ({ value, onChange, optionList }) => {
    return (
      <select
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          // 정렬 바뀌면 Pagenation 초기화
          setVisibleCount(ITEMS_LIMIT);
        }}
      >
        {optionList.map((item, idx) => (
          <option key={`no-${idx}`} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  };

  /**전체 List 반환
   * mockItems 기반으로 '정렬' + '검색' 적용
   */
  const computeList = () => {
    const copyList = JSON.parse(JSON.stringify(mockItems));

    copyList.sort((a, b) => {
      if (orderBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (orderBy === 'highest') {
        return Number(b.points) - Number(a.points);
      } else if (orderBy === 'lowest') {
        return Number(a.points) - Number(b.points);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    if (!searchTerm) return copyList;
    return copyList.filter(
      (item) =>
        item.title.includes(searchTerm) ||
        item.description.includes(searchTerm),
    );
  };

  /** Rendering 목록
   * visibleCount 에 따라 실제로 렌더할 목록 세팅 (더보기는 visibleCount 증가로 동작)
   */
  const updateStudyList = () => {
    const all = computeList();
    setStudyList(all.slice(0, visibleCount));
  };

  useEffect(() => {
    updateStudyList();
  }, [orderBy, searchTerm, visibleCount]);

  /** '더보기' Button Handler
   * 기존 항목 뒤에 이어서 추가 노출
   */
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_LIMIT);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.sectionTitle}>스터디 둘러보기</h1>

      <div className={styles.allStudySectionHeader}>
        <div className={styles.searchBarWrapper}>
          <input
            className={styles.searchBarInput}
            placeholder="검색"
            value={keyword}
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.sortButtonWrapper}>
          <ControlMenu
            value={orderBy}
            onChange={setOrderBy}
            optionList={sortOptionList}
          />
        </div>
      </div>

      <div className={styles.allStudyCardSection}>
        {studyList?.map((item) => (
          <StudyCard key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.moreBtnWrapper}>
        <button className={styles.moreStudyBtn} onClick={handleLoadMore}>
          더보기
        </button>
      </div>
    </div>
  );
}

export default AllStudySection;
