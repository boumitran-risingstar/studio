"use client";

import { useSearchParams } from 'next/navigation';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { VerifyEmailMessage } from '@/components/auth/verify-email-message';

export function ActionHandler() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  switch (mode) {
    case 'resetPassword':
      return <ResetPasswordForm oobCode={oobCode} />;
    case 'verifyEmail':
      return <VerifyEmailMessage oobCode={oobCode} />;
    default:
      return (
        <div className="text-center">
          <h3 className="text-xl font-semibold">Invalid Action</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The link is invalid or has expired.
          </p>
        </div>
      );
  }
}
