
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { LoginSchema } from '@/lib/schemas';
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

type LoginFormValues = z.infer<typeof LoginSchema>;

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

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
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
            title: 'Error signing in',
            description: errorMessage,
            variant: 'destructive',
        });
    } finally {
        setSocialLoading(false);
    }
  }


  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      if (userCredential.user && !userCredential.user.emailVerified) {
        await signOut(auth);
        toast({
            title: 'Email Not Verified',
            description: 'Please verify your email address before signing in.',
            variant: 'destructive'
        });
        router.push(`/verify-email?email=${data.email}`);
        return;
      }
      
      router.push('/');
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password.';
            break;
          default:
            errorMessage = 'Failed to sign in. Please try again.';
            break;
        }
      }
      toast({
        title: 'Error signing in',
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link href="/forgot-password" passHref className="text-sm font-medium text-primary hover:underline">
                        Forgot your password?
                    </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading || socialLoading}>
            {loading ? 'Signing in...' : 'Sign in'}
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
            {socialLoading ? 'Signing in...' : <> <GoogleIcon className="mr-2 h-4 w-4" /> Google </>}
          </Button>
        </div>
        <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                    Sign up now
                </Link>
            </p>
        </div>
      </div>
    </>
  );
}
