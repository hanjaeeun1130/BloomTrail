import SavedRouteCard from "@/components/SavedRouteCard";
import { isSupabaseConfigured, type SavedRoute } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function MyPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="panel mypage-panel">
        <div className="section-heading">
          <p className="section-label">My BloomTrail</p>
          <h1>Supabase 환경 변수가 필요합니다</h1>
          <p>.env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 입력해 주세요.</p>
        </div>
      </section>
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/mypage");
  }

  const { data, error } = await supabase
    .from("saved_routes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const savedRoutes = (data || []) as SavedRoute[];

  return (
    <section className="panel mypage-panel">
      <div className="section-heading">
        <p className="section-label">My BloomTrail</p>
        <h1>내가 저장한 관람 코스</h1>
      </div>

      {error && <p className="form-message">저장 코스를 불러오지 못했습니다. Supabase 설정을 확인해 주세요.</p>}

      {!error && savedRoutes && savedRoutes.length === 0 && (
        <div className="empty-state">
          <h2>아직 저장한 코스가 없습니다.</h2>
          <p>메인 페이지에서 추천 코스를 받은 뒤 “내 코스 저장”을 눌러 보세요.</p>
        </div>
      )}

      <div className="saved-route-grid">
        {savedRoutes?.map((route) => <SavedRouteCard key={route.id} route={route} />)}
      </div>
    </section>
  );
}
