import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Container } from '@/components';
import {
  Header,
  Title,
  Description,
  GetPoints,
  ChartContainer,
} from '@/features/study-detail';
import { mockData } from '@/data/mock-data';

export default function StudyDetailPage() {
  const [data, setData] = useState(mockData);
  const navigate = useNavigate();

  const handleDelete = () => {
    setData(null);
    navigate('/');
  };

  if (!data) return null; // 데이터가 삭제됐다면 null

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
