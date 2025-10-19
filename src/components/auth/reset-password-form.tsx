"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { ResetPasswordSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  oobCode: string | null;
}

export function ResetPasswordForm({ oobCode }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  if (!oobCode) {
    return (
        <div className="text-center">
            <h3 className="text-xl font-semibold">Invalid Link</h3>
            <p className="text-sm text-muted-foreground mt-2">The password reset link is missing or invalid.</p>
            <Button variant="link" asChild className="mt-4">
                <Link href="/login">Back to Sign In</Link>
            </Button>
        </div>
    );
  }


  async function onSubmit(data: ResetPasswordFormValues) {
    setLoading(true);
    setError(null);
    try {
      // Verify the code first
      await verifyPasswordResetCode(auth, oobCode);
      // Then confirm the new password
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess(true);
      toast({
        title: 'Password Reset Successful',
        description: 'You can now sign in with your new password.',
      });
      router.push('/login');
    } catch (error: any) {
      let errorMessage = 'Failed to reset password. The link may have expired.';
       if (error.code === 'auth/expired-action-code') {
        errorMessage = 'The password reset link has expired. Please request a new one.';
      } else if (error.code === 'auth/invalid-action-code') {
        errorMessage = 'The password reset link is invalid. It may have already been used.';
      }
      setError(errorMessage);
      toast({
        title: 'Error Resetting Password',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }
  
  if (success) {
    return (
        <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Password Reset</h3>
            <p className="text-sm text-muted-foreground">
                Your password has been successfully reset.
            </p>
            <Button variant="outline" asChild>
                <Link href="/login">Back to Sign In</Link>
            </Button>
        </div>
    );
  }


  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Reset Your Password</h3>
        <p className="text-sm text-muted-foreground">Enter your new password below.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full !mt-6" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </>
  );
}
