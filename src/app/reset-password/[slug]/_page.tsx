import { ResetPasswordForm } from "@/lib/features/reset-password/components/form/reset-password";

export default async function ResetPasswordPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <ResetPasswordForm token={params.slug} />
    </div>
  );
}
