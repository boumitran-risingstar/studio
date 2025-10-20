import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <div className="p-8">
        <AlertTriangle className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground font-headline">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-2 text-muted-foreground">
          It might have been moved or deleted.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
