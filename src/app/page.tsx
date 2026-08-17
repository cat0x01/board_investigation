import { redirect } from "next/navigation";
import { getOptionalCurrentUserFromCookies } from "@/lib/current-user";

export default async function Home() {
  const user = await getOptionalCurrentUserFromCookies();
<<<<<<< HEAD
  redirect(user ? "/cases" : "/login");
=======
  redirect(user ? "/dashboard" : "/login");
>>>>>>> b94b362dc1c9ae54477d93b700bfac957ca2f756
}
