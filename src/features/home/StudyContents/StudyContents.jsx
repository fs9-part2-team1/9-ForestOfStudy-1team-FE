import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components';
import { StudyCard } from '..';
import searchIcon from '@/assets/icons/common/ic_search.png';
import styles from './StudyContents.module.css';
import CustomSelect from '../CustomSelect/CustomSelect';

export default function StudyContents({ data }) {
  const ITEMS_LIMIT = 6;

  const [studyList, setStudyList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_LIMIT);
  const [orderBy, setOrderBy] = useState('latest');

  const sortOptionList = [
    { value: 'latest', label: '최근 순' },
    { value: 'oldest', label: '오래된 순' },
    { value: 'highest', label: '많은 포인트 순' },
    { value: 'lowest', label: '적은 포인트 순' },
  ];

  const navigate = useNavigate();

  const handleCardClick = (studyId) => {
    navigate(`/study/${studyId}`);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchTerm(keyword);
      setVisibleCount(ITEMS_LIMIT);
    }
  };

  const computeList = () => {
    const copyList = JSON.parse(JSON.stringify(data));

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

  const updateStudyList = () => {
    const all = computeList();
    setStudyList(all.slice(0, visibleCount));
  };

  useEffect(() => {
    updateStudyList();
  }, [orderBy, searchTerm, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_LIMIT);
  };

  return (
    <Container containerClassName={styles.containerClassName}>
      <h1 className={styles.title}>스터디 둘러보기</h1>

      <div className={styles.header}>
        <div className={styles.searchBarWrapper}>
          <img
            className={styles.searchIcon}
            src={searchIcon}
            alt="검색 아이콘"
          />
          <input
            className={styles.searchBarInput}
            placeholder="검색"
            value={keyword}
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <CustomSelect
          value={orderBy}
          onChange={setOrderBy}
          optionList={sortOptionList}
          resetCount={() => setVisibleCount(ITEMS_LIMIT)}
        />
      </div>

      <div className={styles.studyCardSection}>
        {studyList?.map((data) => (
          <StudyCard
            key={data.id}
            data={data}
            studyCardClassName={styles.studyCardClassName}
            onClick={() => handleCardClick(data.id)}
          />
        ))}
      </div>

      <div className={styles.moreBtnWrapper}>
        <button className={styles.moreStudyBtn} onClick={handleLoadMore}>
          더보기
        </button>
      </div>
    </Container>
  );
}
