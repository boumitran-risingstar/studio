
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { SignupSchema } from '@/lib/schemas';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserInExternalApi } from '@/app/actions';

type SignupFormValues = z.infer<typeof SignupSchema>;

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.383,36.366,44,30.659,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    );
}

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function handleSocialLogin() {
    setSocialLoading(true);
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
        await signInWithPopup(auth, provider);
        router.push('/');
    } catch (error: any) {
        let errorMessage = 'Failed to sign in with social provider. Please try again.';
        if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.';
        }
        toast({
            title: 'Error signing up',
            description: errorMessage,
            variant: 'destructive',
        });
    } finally {
        setSocialLoading(false);
    }
  }

  async function onSubmit(data: SignupFormValues) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      await updateProfile(userCredential.user, {
          displayName: data.name
      });
      
      await sendEmailVerification(userCredential.user, {
        url: `${window.location.origin}/action`
      });

      toast({
        title: 'Account created',
        description: "We've sent you an email verification link.",
      });

      router.push(`/verify-email?email=${data.email}`);

    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please sign in.";
      } else {
        errorMessage = 'Failed to create an account. Please try again.';
      }
      toast({
        title: 'Error creating account',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} autoComplete="name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full !mt-6" disabled={loading || socialLoading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={handleSocialLogin} disabled={socialLoading || loading}>
            {socialLoading ? 'Signing up...' : <> <GoogleIcon className="mr-2 h-4 w-4" /> Google </>}
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
