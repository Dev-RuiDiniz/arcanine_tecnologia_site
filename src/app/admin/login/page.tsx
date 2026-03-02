import { AdminLoginForm } from "@/components/auth/admin-login-form";

type AdminLoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const callbackParam = resolvedSearchParams.callbackUrl;
  const callbackUrl = Array.isArray(callbackParam) ? callbackParam[0] : callbackParam;

  return <AdminLoginForm callbackUrl={callbackUrl || "/admin"} />;
}
