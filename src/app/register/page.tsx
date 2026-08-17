import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { getOptionalCurrentUserFromCookies } from "@/lib/current-user";

export default async function RegisterPage() {
  const user = await getOptionalCurrentUserFromCookies();
<<<<<<< HEAD
  if (user) redirect("/cases");

  return <AuthForm mode="register" />;
=======
  if (user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <AuthForm mode="register" />
    </main>
  );
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
