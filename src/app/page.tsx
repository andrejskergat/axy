import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession, getMediaData, SESSION_COOKIE } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const sessionPassword = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionPassword) {
    redirect("/login");
  }

  const result = validateSession(sessionPassword);
  if (!result.valid) {
    redirect("/login");
  }

  const media = getMediaData();

  return <DashboardClient initialMedia={media} />;
}
