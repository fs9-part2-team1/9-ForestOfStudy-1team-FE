import MainLayout from '@/layouts/MainLayout';
import { RecentStudy, StudyContents } from '@/features/home';
import { mockData } from '@/data/mock-data';

export default function HomePage() {
  const data = mockData;

  return (
    <MainLayout>
      <RecentStudy data={data} />
      <StudyContents data={data} />
    </MainLayout>
  );
}
