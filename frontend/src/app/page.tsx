'use client';

import AssessmentForm from '@/components/AssessmentForm';
import LoadingState from '@/components/LoadingState';
import AssessmentResult from '@/components/AssessmentResult';
import AssignmentsList from '@/components/AssignmentsList';
import AssessmentReview from '@/components/AssessmentReview';
import { useAssessmentStore } from '@/store/useAssessmentStore';

import DashboardHome from '../components/DashboardHome';
import MyGroups from '../components/MyGroups';
import AIToolkit from '../components/AIToolkit';

export default function Home() {
  const view = useAssessmentStore((state) => state.view);

  return (
    <main>
      {view === 'list' && <AssignmentsList />}
      {view === 'form' && <AssessmentForm />}
      {view === 'loading' && <LoadingState />}
      {view === 'review' && <AssessmentReview />}
      {view === 'result' && <AssessmentResult />}
      {view === 'home' && <DashboardHome />}
      {view === 'groups' && <MyGroups />}
      {view === 'toolkit' && <AIToolkit />}
    </main>
  );
}
