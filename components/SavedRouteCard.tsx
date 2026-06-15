"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SavedRoute } from "@/lib/supabase";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type SavedRouteCardProps = {
  route: SavedRoute;
};

export default function SavedRouteCard({ route }: SavedRouteCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteSavedRoute() {
    const isConfirmed = window.confirm("이 저장 코스를 삭제할까요?");

    if (!isConfirmed) return;

    setIsDeleting(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("saved_routes").delete().eq("id", route.id);

    setIsDeleting(false);

    if (error) {
      setMessage("삭제하지 못했습니다. 로그인 상태나 Supabase RLS 정책을 확인해 주세요.");
      return;
    }

    router.refresh();
  }

  return (
    <article className="saved-route-card">
      <p className="card-region">{route.arboretum_name}</p>
      <h3>{route.route_name}</h3>
      <p>
        {route.duration} · {route.theme} · {route.companion}
      </p>
      <div className="route-path">{route.zones.join(" → ")}</div>
      <time dateTime={route.created_at}>
        저장일 {new Date(route.created_at).toLocaleDateString("ko-KR")}
      </time>
      <div className="saved-route-actions">
        <button className="delete-route-button" type="button" onClick={deleteSavedRoute} disabled={isDeleting}>
          {isDeleting ? "삭제 중..." : "삭제하기"}
        </button>
      </div>
      {message && <p className="form-message">{message}</p>}
    </article>
  );
}
