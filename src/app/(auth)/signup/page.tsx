import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Create an account</h3>
        <p className="text-sm text-muted-foreground">Start your journey with us.</p>
      </div>
      <SignupForm />
    </>
  );
}
