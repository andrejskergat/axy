import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession, getRoleFromSession, SESSION_COOKIE } from "@/lib/auth";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const cookieStore = cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionValue || !validateSession(sessionValue).valid) redirect("/login");
  if (getRoleFromSession(sessionValue) !== "admin") redirect("/");

  return <AdminClient />;
}
