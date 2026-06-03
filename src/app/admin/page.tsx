import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession, SESSION_COOKIE } from "@/lib/auth";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const cookieStore = cookies();
  const sessionPassword = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionPassword || !validateSession(sessionPassword).valid) {
    redirect("/login");
  }

  return <AdminClient />;
}
