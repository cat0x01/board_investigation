import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getOptionalCurrentUserFromCookies } from "@/lib/current-user";

export default async function RegisterPage() {
  const user = await getOptionalCurrentUserFromCookies();
  if (user) redirect("/cases");

  return <AuthForm mode="register" />;
}
