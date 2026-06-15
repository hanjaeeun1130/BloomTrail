"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { arboretums, type Arboretum, type ArboretumRoute } from "@/lib/arboretumData";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

const visitTimes = [30, 60, 90];
const themes = ["꽃", "단풍", "숲길", "희귀식물", "사진", "휴식"];
const companions = ["혼자", "친구", "가족", "아이와 함께"];
const operatorTypes = ["전체", "국립", "공립", "사립", "학교"] as const;
const nationalStats = [
  { label: "전체 등록 수목원", value: "73개소", detail: "2025년 6월 말 기준" },
  { label: "국립 수목원", value: "4개소", detail: "국가 단위 식물자원 보전" },
  { label: "공립 수목원", value: "37개소", detail: "지자체 중심 자연학습·휴식 공간" },
  { label: "사립·학교 수목원", value: "32개소", detail: "사립 29개소, 학교 3개소" },
];
const knowledgeLinks = [
  {
    title: "식물도감",
    description: "수목원에서 본 식물의 이름과 특징을 찾아보는 기본 자료입니다.",
    source: "국가생물종지식정보시스템",
    url: "https://www.nature.go.kr/main/Main.do",
  },
  {
    title: "보호식물",
    description: "적색목록과 특산식물 등 보전 가치가 높은 식물 정보를 확인합니다.",
    source: "국가생물종지식정보시스템",
    url: "https://www.nature.go.kr/main/Main.do",
  },
  {
    title: "식물표본·세밀화",
    description: "표본과 세밀화 자료를 통해 잎, 꽃, 열매의 관찰 포인트를 비교합니다.",
    source: "국가생물종지식정보시스템",
    url: "https://www.nature.go.kr/main/Main.do",
  },
  {
    title: "정원백과·식물계절관측",
    description: "정원 식물 활용과 계절 변화 정보를 관람 테마 추천에 참고합니다.",
    source: "국립수목원 연계 서비스",
    url: "https://www.nature.go.kr/main/Main.do",
  },
];
const observationGuides = [
  "식물 이름을 모를 때는 잎 배열, 꽃 색, 열매 모양, 줄기 특징을 함께 기록하세요.",
  "희귀식물 구역에서는 훼손을 막기 위해 지정 동선 밖으로 나가지 않는 관람이 중요합니다.",
  "사진 테마 코스는 꽃이 밝게 보이는 오전 시간과 그늘이 부드러운 숲길을 함께 추천합니다.",
  "계절별 관람은 개화 여부뿐 아니라 단풍, 종자, 열매, 습지 생태까지 함께 보면 더 풍성합니다.",
];

function findZoneName(arboretum: Arboretum, zoneId: string) {
  return arboretum.zones.find((zone) => zone.id === zoneId)?.name || zoneId;
}

function getNaverMapSearchUrl(arboretum: Arboretum) {
  return `https://map.naver.com/p/search/${encodeURIComponent(`${arboretum.name} ${arboretum.address}`)}`;
}

function findBestRoute(arboretum: Arboretum, visitTime: number, theme: string, companion: string) {
  const exactRoute = arboretum.routes.find(
    (route) =>
      route.duration === visitTime &&
      route.themes.includes(theme) &&
      route.companion.includes(companion),
  );

  if (exactRoute) return exactRoute;

  return [...arboretum.routes]
    .map((route) => {
      let score = 0;
      if (route.themes.includes(theme)) score += 3;
      if (route.duration === visitTime) score += 2;
      if (route.companion.includes(companion)) score += 1;
      return { route, score };
    })
    .sort((a, b) => b.score - a.score)[0].route;
}

export default function BloomTrailApp() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [operatorFilter, setOperatorFilter] = useState<(typeof operatorTypes)[number]>("전체");
  const [selectedArboretum, setSelectedArboretum] = useState(arboretums[0]);
  const [visitTime, setVisitTime] = useState(60);
  const [theme, setTheme] = useState("꽃");
  const [companion, setCompanion] = useState("혼자");
  const [recommendedRoute, setRecommendedRoute] = useState<ArboretumRoute | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [mapImageFailed, setMapImageFailed] = useState(false);

  useEffect(() => {
    setMapImageFailed(false);
  }, [selectedArboretum.id]);

  const filteredArboretums = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return arboretums.filter((arboretum) => {
      if (operatorFilter !== "전체" && arboretum.operatorType !== operatorFilter) {
        return false;
      }

      if (!normalizedKeyword) {
        return true;
      }

      const searchableText = [
        arboretum.name,
        arboretum.region,
        arboretum.description,
        arboretum.operatorType,
        ...arboretum.themes,
        ...arboretum.aliases,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [keyword, operatorFilter]);

  const recommendedSpots = useMemo(() => {
    const sameTheme = selectedArboretum.spots.filter((spot) => spot.theme === theme);
    const others = selectedArboretum.spots.filter((spot) => spot.theme !== theme);
    return [...sameTheme, ...others].slice(0, 3);
  }, [selectedArboretum, theme]);

  function handleRecommend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage("");
    setRecommendedRoute(findBestRoute(selectedArboretum, visitTime, theme, companion));
  }

  function selectArboretumAndMove(arboretum: Arboretum) {
    setSelectedArboretum(arboretum);
    setRecommendedRoute(null);
    setSaveMessage("");

    window.setTimeout(() => {
      document.querySelector("#selected-garden")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  async function saveRecommendedRoute() {
    if (!recommendedRoute) return;

    if (!isSupabaseConfigured()) {
      setSaveMessage(".env.local에 Supabase URL과 ANON KEY를 입력한 뒤 저장 기능을 사용할 수 있습니다.");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?redirectTo=/");
      return;
    }

    const zones = recommendedRoute.zoneIds.map((zoneId) => findZoneName(selectedArboretum, zoneId));

    const { error } = await supabase.from("saved_routes").insert({
      user_id: user.id,
      arboretum_name: selectedArboretum.name,
      route_name: recommendedRoute.name,
      duration: `${recommendedRoute.duration}분`,
      theme,
      companion,
      zones,
    });

    setSaveMessage(error ? "코스 저장에 실패했습니다. Supabase 설정과 RLS 정책을 확인해 주세요." : "내 코스에 저장했습니다.");
  }

  const activeZoneIds = recommendedRoute?.zoneIds || [];

  return (
    <>
      <section className="hero">
        <div className="hero-brand-panel">
          <span className="agency-mark">BT</span>
          <div>
            <strong>BloomTrail</strong>
            <span>Domestic Arboretum Course Guide</span>
          </div>
        </div>
        <div className="hero-content">
          <p className="hero-label">BloomTrail</p>
          <h1>국내 수목원 맞춤 관람 코스 추천 서비스</h1>
          <p>전국 주요 수목원을 검색하고 방문 시간, 관심 테마, 동행 유형에 맞는 코스를 바로 확인해 보세요.</p>
          <a className="hero-button" href="#arboretum-search">
            수목원 검색 시작하기
          </a>
        </div>
        <div className="hero-caption">국내 수목원 공개 정보를 바탕으로 구성한 예시 추천 서비스</div>
      </section>

      <section className="panel search-panel" id="arboretum-search">
        <div className="national-status">
          <div>
            <p className="section-label">National Arboretum Status</p>
            <h2>전국 수목원 현황 기반 추천</h2>
            <p>
              e-나라지표의 산림청 수목원 현황을 참고해 국립·공립·사립·학교 수목원 분류와
              국내 등록 수목원 규모를 서비스 맥락에 반영했습니다.
            </p>
          </div>
          <a
            className="source-link"
            href="https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1307"
            target="_blank"
            rel="noreferrer"
          >
            e-나라지표 수목원 현황 보기
          </a>
        </div>
        <div className="national-stat-grid">
          {nationalStats.map((stat) => (
            <article key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </div>
        <div className="section-heading">
          <p className="section-label">Arboretum Search</p>
          <h2>국내 수목원 검색</h2>
          <p>이름, 지역, 테마로 검색할 수 있습니다. 예: 국립, 제주, 숲길, 온실, 가평</p>
        </div>
        <div className="operator-filter" aria-label="수목원 운영 유형 필터">
          {operatorTypes.map((type) => (
            <button
              className={operatorFilter === type ? "active" : ""}
              type="button"
              key={type}
              onClick={() => setOperatorFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="search-control">
          <input
            type="search"
            value={keyword}
            placeholder="수목원 이름, 지역, 테마를 입력하세요"
            onChange={(event) => setKeyword(event.target.value)}
          />
          {keyword && (
            <button type="button" onClick={() => setKeyword("")}>
              초기화
            </button>
          )}
        </div>
        <div className="result-toolbar">
          <strong>{filteredArboretums.length}개 수목원</strong>
          <span>총 {arboretums.length}개 예시 데이터 중 검색 결과</span>
        </div>
        <div className="search-results">
          {filteredArboretums.length === 0 && (
            <div className="empty-state">
              <h3>검색 결과가 없습니다.</h3>
              <p>지역명이나 테마를 조금 더 넓게 입력해 보세요. 예: 경기, 꽃, 숲길, 국립</p>
            </div>
          )}
          {filteredArboretums.map((arboretum) => (
            <article className="arboretum-card" key={arboretum.id}>
              <span className="card-kicker">{arboretum.sourceLabel}</span>
              <h3>{arboretum.name}</h3>
              <p className="card-region">{arboretum.region}</p>
              <span className="operator-badge">{arboretum.operatorType} 수목원</span>
              <p>{arboretum.description}</p>
              <ul className="mini-highlight-list">
                {arboretum.highlights.slice(0, 2).map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <div className="theme-tags">
                {arboretum.themes.map((item) => (
                  <span className="theme-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => selectArboretumAndMove(arboretum)}
              >
                선택하기
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel selected-card" id="selected-garden">
        <p className="section-label">Selected Garden</p>
        <h2>{selectedArboretum.name}</h2>
        <p className="card-region">{selectedArboretum.region}</p>
        <span className="operator-badge">{selectedArboretum.operatorType} 수목원</span>
        <p>{selectedArboretum.description}</p>
        <div className="quick-link-row">
          <a className="source-link" href={selectedArboretum.sourceUrl} target="_blank" rel="noreferrer">
            참고 자료: {selectedArboretum.sourceLabel}
          </a>
          <a className="map-link-button" href={getNaverMapSearchUrl(selectedArboretum)} target="_blank" rel="noreferrer">
            네이버 지도에서 위치 보기
          </a>
        </div>
        <div className="detail-grid">
          <article>
            <span>위치 정보</span>
            <p className="address-text">{selectedArboretum.address}</p>
            <p>{selectedArboretum.locationNote}</p>
          </article>
          <article>
            <span>추천 포인트</span>
            <ul>
              {selectedArboretum.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>관람 힌트</span>
            <p>{selectedArboretum.visitTip}</p>
          </article>
        </div>
        <div className="keyword-strip">
          <span>검색 키워드</span>
          <div className="keyword-cloud">
            {selectedArboretum.aliases.slice(0, 10).map((alias) => (
              <button type="button" key={alias} onClick={() => setKeyword(alias)}>
                {alias}
              </button>
            ))}
          </div>
        </div>
        <div className="zone-list">
          {selectedArboretum.zones.map((zone) => (
            <div key={zone.id}>
              <strong>{zone.name}</strong>
              <span>{zone.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel knowledge-panel" id="biodiversity-info">
        <div className="section-heading">
          <p className="section-label">Biodiversity Knowledge</p>
          <h2>생물정보 기반 관람 가이드</h2>
          <p>
            국가생물종지식정보시스템과 국립수목원 공개 자료의 정보 구조를 참고해,
            수목원 관람 중 함께 확인하면 좋은 식물 지식 항목을 정리했습니다.
          </p>
        </div>
        <div className="knowledge-layout">
          <div className="knowledge-card-grid">
            {knowledgeLinks.map((item) => (
              <a className="knowledge-card" href={item.url} key={item.title} target="_blank" rel="noreferrer">
                <span>{item.source}</span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
          <aside className="observation-note">
            <h3>관찰 체크리스트</h3>
            <ul>
              {observationGuides.map((guide) => (
                <li key={guide}>{guide}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-label">Travel Preferences</p>
          <h2>관람 조건 선택</h2>
        </div>
        <form className="recommend-form" onSubmit={handleRecommend}>
          <fieldset>
            <legend>관람 시간</legend>
            {visitTimes.map((time) => (
              <label key={time}>
                <input
                  checked={visitTime === time}
                  name="visitTime"
                  type="radio"
                  onChange={() => setVisitTime(time)}
                />
                {time}분
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>관심 테마</legend>
            {themes.map((item) => (
              <label key={item}>
                <input checked={theme === item} name="theme" type="radio" onChange={() => setTheme(item)} />
                {item}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>동행 유형</legend>
            {companions.map((item) => (
              <label key={item}>
                <input
                  checked={companion === item}
                  name="companion"
                  type="radio"
                  onChange={() => setCompanion(item)}
                />
                {item}
              </label>
            ))}
          </fieldset>
          <button className="recommend-button" type="submit">
            맞춤 코스 추천받기
          </button>
        </form>
      </section>

      <section className="panel route-options">
        <div className="section-heading">
          <p className="section-label">Course Library</p>
          <h2>{selectedArboretum.name} 코스 후보</h2>
          <p>관람 시간과 관심사에 맞춰 아래 코스 중 가장 잘 맞는 코스를 추천합니다.</p>
        </div>
        <div className="course-preview-grid">
          {selectedArboretum.routes.map((route) => (
            <article className={recommendedRoute?.id === route.id ? "selected-course-preview" : ""} key={route.id}>
              <strong>{route.name}</strong>
              <span>
                {route.duration}분 · {route.difficulty}
              </span>
              <p>{route.zoneIds.map((zoneId) => findZoneName(selectedArboretum, zoneId)).join(" → ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel route-card" id="route-result">
        <p className="section-label">Recommended Course</p>
        {recommendedRoute ? (
          <>
            <h2>{recommendedRoute.name}</h2>
            <p className="route-meta">
              {recommendedRoute.duration}분 · 난이도 {recommendedRoute.difficulty}
            </p>
            <div className="route-path">
              {recommendedRoute.zoneIds.map((zoneId) => findZoneName(selectedArboretum, zoneId)).join(" → ")}
            </div>
            <p>{recommendedRoute.reason}</p>
            <button className="save-button" type="button" onClick={saveRecommendedRoute}>
              내 코스 저장
            </button>
            {saveMessage && <p className="form-message">{saveMessage}</p>}
          </>
        ) : (
          <>
            <h2>추천 코스가 아직 없습니다.</h2>
            <p>관람 조건을 선택한 뒤 추천 버튼을 눌러 주세요.</p>
          </>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-label">Inner Mini Map</p>
          <h2>수목원 내부 구역 미니맵</h2>
          <p>
            공식 홈페이지의 안내도와 수목원 소개 정보를 참고해 내부 구역을 단순화한 도식 지도입니다.
            실제 지도 이미지를 복사하지 않고 구역 관계를 노드형으로 표현합니다.
          </p>
          <div className="quick-link-row">
            <a
              className="source-link"
              href={selectedArboretum.mapReferenceUrl || selectedArboretum.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              {selectedArboretum.mapReferenceLabel || `${selectedArboretum.name} 공식 자료 보기`}
            </a>
            <a className="map-link-button" href={getNaverMapSearchUrl(selectedArboretum)} target="_blank" rel="noreferrer">
              네이버 지도 위치 열기
            </a>
          </div>
        </div>
        {selectedArboretum.mapImageUrl && !mapImageFailed ? (
          <div className="official-map-panel">
            <img
              src={selectedArboretum.mapImageUrl}
              alt={selectedArboretum.mapImageAlt || `${selectedArboretum.name} 안내도`}
              onError={() => setMapImageFailed(true)}
            />
            <div className="official-map-caption">
              <strong>{selectedArboretum.mapImageAlt || `${selectedArboretum.name} 안내도`}</strong>
              <span>추천 코스 구역: {activeZoneIds.length > 0 ? activeZoneIds.map((zoneId) => findZoneName(selectedArboretum, zoneId)).join(" → ") : "코스 추천 후 표시됩니다."}</span>
            </div>
          </div>
        ) : (
          <>
          <div className="map-summary-card">
            <strong>{selectedArboretum.name} 구역 구성</strong>
            <span>
              {selectedArboretum.zones.map((zone) => zone.name).join(" · ")}
            </span>
          </div>
          <div className="map-area">
            <div className="map-route-line" aria-hidden="true" />
            {selectedArboretum.zones.map((zone, index) => (
              <article
                className={`map-node map-node-${zone.type} ${activeZoneIds.includes(zone.id) ? "active" : ""}`}
                key={zone.id}
              >
                <span className="map-step">{index + 1}</span>
                <strong>{zone.name}</strong>
                <small>{zone.description}</small>
              </article>
            ))}
          </div>
          </>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <p className="section-label">Viewing Points</p>
          <h2>추천 식물 및 관람 포인트</h2>
        </div>
        <div className="spot-card-list">
          {recommendedSpots.map((spot) => (
            <article className="spot-card" key={`${spot.name}-${spot.zone}`}>
              <h3>{spot.name}</h3>
              <p className="card-region">
                {spot.zone} · {spot.season}
              </p>
              <span className="theme-tag">{spot.theme}</span>
              <p>{spot.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
