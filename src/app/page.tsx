"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-full h-full flex items-center justify-center">
             <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      </div>
  );
}
