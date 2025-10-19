import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Sign in to your account</h3>
        <p className="text-sm text-muted-foreground">Welcome back!</p>
      </div>
      <LoginForm />
    </>
  );
}
