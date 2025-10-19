import { Suspense } from 'react';
import { ActionHandler } from '@/components/auth/action-handler';

export default function ActionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActionHandler />
    </Suspense>
  );
}
