import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession, getMediaData, SESSION_COOKIE, getRoleFromSession } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionValue) redirect("/login");

  const result = validateSession(sessionValue);
  if (!result.valid) redirect("/login");

  const role = getRoleFromSession(sessionValue);
  const media = getMediaData();

  return <DashboardClient initialMedia={media} isAdmin={role === "admin"} />;
}
