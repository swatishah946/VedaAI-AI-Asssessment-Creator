'use client';

import AssessmentForm from '@/components/AssessmentForm';
import LoadingState from '@/components/LoadingState';
import AssessmentResult from '@/components/AssessmentResult';
import AssignmentsList from '@/components/AssignmentsList';
import { useAssessmentStore } from '@/store/useAssessmentStore';

export default function Home() {
  const { view } = useAssessmentStore();

  return (
    <main>
      {view === 'list' && <AssignmentsList />}
      {view === 'form' && <AssessmentForm />}
      {view === 'loading' && <LoadingState />}
      {view === 'result' && <AssessmentResult />}
    </main>
  );
}
