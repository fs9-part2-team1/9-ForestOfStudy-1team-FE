import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Container } from '@/components';
import {
  Header,
  Title,
  Description,
  GetPoints,
  ChartContainer,
} from '@/features/study-detail';
import { studyAPI } from '@/api/studyAPI';

export default function StudyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    const fetchStudy = async () => {
      if (!id) return;
      try {
        const study = await studyAPI.getStudyById(id);
        setData(study);
      } catch (err) {
        console.error(err);
        navigate('/'); // 스터디 없으면 홈으로
      } finally {
        setLoading(false);
      }
    };
    fetchStudy();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await studyAPI.deleteStudy(id);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <MainLayout disabled>
        <Container>
          <p>스터디 데이터를 불러오는 중...</p>
        </Container>
      </MainLayout>
    );
  }

  if (!data) return null;

  return (
    <MainLayout disabled>
      <Container>
        <Header data={data} onDelete={handleDelete} />
        <Title data={data} />
        <Description description={data.description} />
        <GetPoints points={data.points} />
        <ChartContainer habits={data.habits} />
      </Container>
    </MainLayout>
  );
}
