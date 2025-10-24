import { useState, useEffect } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { RecentStudy, StudyContents } from '@/features/home';
import { studyAPI } from '@/api/studyAPI';

export default function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const studies = await studyAPI.getStudies({
          orderBy: 'latest',
          search: '',
          page: 1,
        });
        setData(studies);
      } catch (error) {
        console.error('스터디 목록 불러오기 실패', error);
      }
    };
    fetchStudies();
  }, []);

  return (
    <MainLayout>
      <RecentStudy data={data} />
      <StudyContents data={data} />
    </MainLayout>
  );
}
