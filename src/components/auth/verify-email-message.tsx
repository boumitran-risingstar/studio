"use client";

import { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface VerifyEmailMessageProps {
  oobCode: string | null;
}

export function VerifyEmailMessage({ oobCode }: VerifyEmailMessageProps) {
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (!oobCode) {
        setError('Invalid verification link.');
        setVerifying(false);
        return;
      }
      try {
        await applyActionCode(auth, oobCode);
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified. You can now log in.',
        });
        router.push('/login');
      } catch (err: any) {
        let errorMessage = 'Failed to verify email. The link may be invalid or expired.';
        if (err.code === 'auth/expired-action-code') {
            errorMessage = 'The verification link has expired. Please request a new one.';
        } else if (err.code === 'auth/invalid-action-code') {
            errorMessage = 'The verification link is invalid. It may have already been used.';
        }
        setError(errorMessage);
        toast({
          title: 'Verification Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        setVerifying(false);
      }
    };

    handleVerifyEmail();
  }, [oobCode, auth, toast, router]);

  if (verifying) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold">Verifying your email...</h3>
        <p className="text-sm text-muted-foreground mt-2">Please wait a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold text-destructive">Verification Failed</h3>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/login">Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  // This part is unlikely to be seen due to redirection on success
  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-primary">Email Verified!</h3>
      <p className="text-sm text-muted-foreground mt-2">Redirecting you to the login page...</p>
    </div>
  );
}
