import MainLayout from '@/layouts/MainLayout';
import RecentStudySection from './RecentStudySection.jsx';
import AllStudySection from './AllStudySection.jsx';

export default function HomePage() {
  return (
    <MainLayout>
      {/* <RecentStudySection /> */}
      <AllStudySection />
    </MainLayout>
  );
}
