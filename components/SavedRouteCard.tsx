import type { SavedRoute } from "@/lib/supabase";

type SavedRouteCardProps = {
  route: SavedRoute;
};

export default function SavedRouteCard({ route }: SavedRouteCardProps) {
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
    </article>
  );
}
