import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { MakeStudyPage } from '@/pages/make-study';
import { StudyDetailPage } from '@/pages/study-detail';
import { TodayFocusPage } from '@/pages/today-focus';
import { TodayHabitPage } from '@/pages/today-habit';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/make-study" element={<MakeStudyPage />}>
        <Route index element={<MakeStudyPage />} />
        <Route path=":id" element={<MakeStudyPage />} />
      </Route>
      <Route path="/study-detail" element={<StudyDetailPage />} />
      <Route path="/study-detail/:id" element={<StudyDetailPage />} />
      <Route path="/today-focus" element={<TodayFocusPage />} />
      <Route path="/today-habit" element={<TodayHabitPage />} />
      <Route path="/today-habit/:id" element={<TodayHabitPage />} />
    </Routes>
  );
}
