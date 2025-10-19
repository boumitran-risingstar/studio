import { Logo } from '@/components/icons/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo className="mx-auto h-12 w-auto text-primary" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-foreground font-headline">
          Mouth Metrics
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-card px-4 py-8 shadow-lg sm:rounded-xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
