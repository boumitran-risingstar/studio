import { VerifyEmail } from '@/components/auth/verify-email';
import { Suspense } from 'react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
}
