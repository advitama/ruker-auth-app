import { ForgotPasswordForm } from "@/features/reset-password/components/form/forgot-password";

/*
  * The ForgotPasswordPage component is a form that allows users to reset their password.
  * It uses the ForgotPasswordForm component to create the form.
*/ 
export default async function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <ForgotPasswordForm />
    </div>
  );
}
