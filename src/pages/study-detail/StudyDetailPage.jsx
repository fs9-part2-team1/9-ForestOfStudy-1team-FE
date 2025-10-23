import { useState } from 'react';
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
import { mockData } from '@/data/mock-data';

export default function StudyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(() => mockData.find((d) => d.id === id));

  const handleDelete = () => {
    setData(null);
    navigate('/');
  };

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
