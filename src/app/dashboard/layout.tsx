"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth as useFirebaseAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, Settings, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    // This is shown while checking auth state or if user is not logged in.
    return (
        <div className="flex items-center justify-center h-screen bg-background">
          <p>Loading...</p>
        </div>
    );
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const getInitials = (email: string | null) => {
    if (!email) return '..';
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      await user.sendEmailVerification();
      // Optionally, show a toast notification
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
              <Logo className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold font-headline">Mouth Metrics</span>
          </Link>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
            {!user.emailVerified && (
              <Alert variant="destructive" className="mb-6">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Verify your email address</AlertTitle>
                <AlertDescription>
                  Please check your inbox to verify your email. You won't be able to use all features until you've verified your account. 
                  <Button variant="link" className="p-0 h-auto ml-2" onClick={() => router.push(`/verify-email?email=${user.email}`)}>
                    Resend verification
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            {children}
        </div>
      </main>
    </div>
  );
}
