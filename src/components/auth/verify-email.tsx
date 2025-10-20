
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
        if (user.emailVerified) {
            router.replace('/');
        }
    }
  }, [user, isUserLoading, router]);

  const handleResendVerification = useCallback(async () => {
    if (!user) return;
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: 'Verification email sent',
        description: 'A new verification link has been sent to your email address.',
      });
    } catch (error) {
      toast({
        title: 'Error sending verification',
        description: 'Failed to send a new verification email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold">Verify Your Email</h3>
      <p className="text-muted-foreground">
        We've sent a verification link to{' '}
        <span className="font-semibold text-foreground">{email || (user?.email)}</span>. Please
        check your inbox and click the link to activate your account.
      </p>

      {user && !user.emailVerified && (
        <div className='space-y-4'>
            <p className="text-sm text-muted-foreground">
                Email still not there? Check your spam folder or resend the email.
            </p>
            <Button onClick={handleResendVerification} disabled={isResending}>
              {isResending ? 'Resending...' : 'Resend Verification Email'}
            </Button>
        </div>
      )}

      <div className="flex items-center justify-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/login">Back to Sign In</Link>
        </Button>
        <Button variant="link" onClick={handleSignOut}>Sign out</Button>
      </div>
    </div>
  );
}
