import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { isSupabaseConfigured } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export default async function Header() {
  let user = null;

  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  }

  return (
    <header className="site-header">
      <div className="government-strip">
        <span>이 서비스는 국내 수목원 공개 정보를 바탕으로 만든 BloomTrail 과제용 안내 서비스입니다.</span>
        <span>한국어</span>
      </div>
      <nav className="navbar" aria-label="주요 메뉴">
        <Link className="logo" href="/">
          <span className="logo-symbol">BT</span>
          <span>
            <strong>BloomTrail</strong>
            <small>국내 수목원 코스 안내</small>
          </span>
        </Link>
        <div className="primary-menu" aria-label="서비스 메뉴">
          <Link href="/#arboretum-search">수목원안내</Link>
          <Link href="/#biodiversity-info">생물정보</Link>
          <Link href="/#route-result">코스추천</Link>
          <Link href="/mypage">마이페이지</Link>
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <Link href="/mypage">내 코스</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <Link href="/signup">회원가입</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
