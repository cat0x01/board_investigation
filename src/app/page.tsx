import { redirect } from "next/navigation";
import { getOptionalCurrentUserFromCookies } from "@/lib/current-user";

export default async function Home() {
  const user = await getOptionalCurrentUserFromCookies();
  redirect(user ? "/cases" : "/login");
}
