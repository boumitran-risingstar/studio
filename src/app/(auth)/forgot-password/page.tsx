import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Forgot your password?</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
