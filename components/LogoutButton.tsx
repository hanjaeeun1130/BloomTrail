"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      router.push("/login");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="nav-button" type="button" onClick={handleLogout}>
      로그아웃
    </button>
  );
}
