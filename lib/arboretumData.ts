export type ArboretumZone = {
  id: string;
  name: string;
  type: string;
  description: string;
};

export type ArboretumRoute = {
  id: string;
  name: string;
  duration: number;
  themes: string[];
  companion: string[];
  zoneIds: string[];
  difficulty: string;
  reason: string;
};

export type ArboretumSpot = {
  name: string;
  zone: string;
  season: string;
  theme: string;
  description: string;
};

export type Arboretum = {
  id: string;
  name: string;
  region: string;
  description: string;
  themes: string[];
  aliases: string[];
  sourceLabel: string;
  sourceUrl: string;
  mapImageUrl?: string;
  mapImageAlt?: string;
  highlights: string[];
  visitTip: string;
  zones: ArboretumZone[];
  routes: ArboretumRoute[];
  spots: ArboretumSpot[];
};

const commonZones: ArboretumZone[] = [
  { id: "entrance", name: "방문자센터", type: "start", description: "관람 안내와 동선 확인을 시작하는 구역입니다." },
  { id: "flower", name: "계절정원", type: "flower", description: "계절 꽃과 정원 식재를 감상하는 대표 구역입니다." },
  { id: "forest", name: "숲길", type: "forest", description: "나무 그늘과 산책로를 따라 걷는 구역입니다." },
  { id: "rare", name: "희귀식물원", type: "rare", description: "특산식물과 보전 가치가 높은 식물을 살피는 공간입니다." },
  { id: "greenhouse", name: "온실", type: "greenhouse", description: "실내에서 다양한 기후대 식물을 만나는 공간입니다." },
  { id: "wetland", name: "습지원", type: "wetland", description: "수생식물과 습지 생태를 관찰하는 구역입니다." },
  { id: "rest", name: "전망쉼터", type: "rest", description: "관람 중 쉬어 가며 풍경을 보는 공간입니다." },
];

function createRoutes(id: string, prefix: string): ArboretumRoute[] {
  return [
    {
      id: `${id}-short`,
      name: `${prefix} 핵심 산책 코스`,
      duration: 30,
      themes: ["휴식", "사진", "꽃"],
      companion: ["혼자", "아이와 함께", "가족"],
      zoneIds: ["entrance", "flower", "rest"],
      difficulty: "쉬움",
      reason: "짧은 시간 안에 입구, 계절정원, 쉼터를 연결해 부담 없이 둘러볼 수 있습니다.",
    },
    {
      id: `${id}-forest`,
      name: `${prefix} 숲길 관찰 코스`,
      duration: 60,
      themes: ["숲길", "단풍", "휴식"],
      companion: ["혼자", "친구", "가족"],
      zoneIds: ["entrance", "forest", "wetland", "rest"],
      difficulty: "보통",
      reason: "숲길과 습지원 중심으로 수목원의 자연성을 느끼기 좋은 균형형 코스입니다.",
    },
    {
      id: `${id}-deep`,
      name: `${prefix} 식물 탐방 코스`,
      duration: 90,
      themes: ["희귀식물", "꽃", "사진", "숲길"],
      companion: ["혼자", "친구", "가족"],
      zoneIds: ["entrance", "rare", "greenhouse", "flower", "forest", "wetland", "rest"],
      difficulty: "보통",
      reason: "희귀식물, 온실, 정원, 숲길을 폭넓게 지나며 관람 포인트를 풍부하게 확인할 수 있습니다.",
    },
  ];
}

function createSpots(flower: string, rare: string, forest: string): ArboretumSpot[] {
  return [
    { name: flower, zone: "계절정원", season: "봄~가을", theme: "꽃", description: "정원 색감과 식재 구성을 함께 보기 좋은 포인트입니다." },
    { name: rare, zone: "희귀식물원", season: "봄~여름", theme: "희귀식물", description: "지역성과 보전 가치가 있는 식물의 잎, 꽃, 수형을 관찰해 보세요." },
    { name: forest, zone: "숲길", season: "가을", theme: "단풍", description: "걷기 좋은 숲길에서 계절 변화와 나무 그늘을 느낄 수 있습니다." },
    { name: "전망 쉼터", zone: "전망쉼터", season: "사계절", theme: "휴식", description: "긴 관람 중 동선을 정리하고 쉬어 가기 좋은 지점입니다." },
  ];
}

function createArboretum(data: Omit<Arboretum, "zones" | "routes" | "spots"> & {
  flower: string;
  rare: string;
  forest: string;
  zoneOverrides?: Partial<Record<string, string>>;
}): Arboretum {
  const zones = commonZones.map((zone) => ({
    ...zone,
    name: data.zoneOverrides?.[zone.id] || zone.name,
  }));

  return {
    id: data.id,
    name: data.name,
    region: data.region,
    description: data.description,
    themes: data.themes,
    aliases: data.aliases,
    sourceLabel: data.sourceLabel,
    sourceUrl: data.sourceUrl,
    mapImageUrl: data.mapImageUrl,
    mapImageAlt: data.mapImageAlt,
    highlights: data.highlights,
    visitTip: data.visitTip,
    zones,
    routes: createRoutes(data.id, data.name.replace(/수목원|식물원/g, "")),
    spots: createSpots(data.flower, data.rare, data.forest),
  };
}

export const arboretums: Arboretum[] = [
  createArboretum({
    id: "korea-national",
    name: "국립수목원",
    region: "경기 포천",
    description: "광릉숲을 기반으로 한 국가 대표 수목원으로 숲길, 생물다양성, 희귀식물 관람에 적합합니다.",
    themes: ["숲길", "희귀식물", "휴식", "단풍"],
    aliases: ["광릉", "포천", "경기도", "국립", "korea national arboretum"],
    sourceLabel: "국립수목원 공식 홈페이지",
    sourceUrl: "https://kna.forest.go.kr/",
    highlights: ["광릉숲 기반 생태 관람", "희귀특산식물 관찰", "숲길 중심의 조용한 코스"],
    visitTip: "생태 보전 성격이 강한 수목원이므로 숲길 관찰과 희귀식물 구역을 중심으로 여유 있게 둘러보는 코스를 추천합니다.",
    flower: "광릉숲 야생화",
    rare: "희귀특산식물",
    forest: "광릉숲 활엽수길",
    zoneOverrides: { forest: "광릉숲길", rare: "희귀특산식물원", greenhouse: "난대온실" },
  }),
  createArboretum({
    id: "baekdudaegan",
    name: "국립백두대간수목원",
    region: "경북 봉화",
    description: "백두대간 산림 생태와 고산식물, 넓은 숲 경관을 중심으로 관람하는 대형 국립수목원입니다.",
    themes: ["숲길", "희귀식물", "사진", "휴식"],
    aliases: ["봉화", "경북", "백두대간", "호랑이숲", "국립"],
    sourceLabel: "국립백두대간수목원 공식 홈페이지",
    sourceUrl: "https://www.bdna.or.kr/",
    highlights: ["백두대간 산림 경관", "고산식물 관찰", "넓은 동선을 활용한 장거리 산책"],
    visitTip: "규모가 큰 수목원이므로 30분 코스보다는 60분 이상 코스에서 숲길과 전망 구역을 함께 보는 것이 좋습니다.",
    flower: "야생화 언덕",
    rare: "고산식물",
    forest: "백두대간 숲길",
    zoneOverrides: { rare: "고산식물원", forest: "백두대간숲길", rest: "전망데크" },
  }),
  createArboretum({
    id: "sejong-national",
    name: "국립세종수목원",
    region: "세종 연기",
    description: "도심 가까이에서 사계절전시온실과 한국전통정원, 생활정원을 함께 둘러보는 수목원입니다.",
    themes: ["꽃", "사진", "휴식", "희귀식물"],
    aliases: ["세종", "국립", "사계절전시온실", "한국전통정원"],
    sourceLabel: "국립세종수목원 공식 홈페이지",
    sourceUrl: "https://www.sjna.or.kr/",
    highlights: ["사계절전시온실", "한국전통정원", "도심 접근성이 좋은 정원 산책"],
    visitTip: "온실과 전통정원, 생활정원을 묶으면 날씨 영향을 덜 받는 안정적인 관람 코스를 만들 수 있습니다.",
    flower: "생활정원 초화",
    rare: "온실 열대식물",
    forest: "정원 산책로",
    zoneOverrides: { greenhouse: "사계절전시온실", flower: "생활정원", forest: "한국전통정원", rest: "방문자 쉼터" },
  }),
  createArboretum({
    id: "morning-calm",
    name: "아침고요수목원",
    region: "경기 가평",
    description: "정원형 경관과 계절 축제가 알려진 수목원으로 꽃, 사진, 휴식 테마에 잘 맞습니다.",
    themes: ["꽃", "사진", "휴식", "단풍"],
    aliases: ["가평", "경기", "축령산", "아침고요"],
    sourceLabel: "아침고요수목원 공식 홈페이지",
    sourceUrl: "https://www.morningcalm.co.kr/",
    highlights: ["계절 정원 경관", "사진 촬영에 좋은 정원 동선", "가평 여행과 연계하기 좋은 위치"],
    visitTip: "꽃과 사진 테마를 선택하면 하경정원과 수변 구역 중심으로 밝은 코스를 구성하기 좋습니다.",
    flower: "수국과 계절 초화",
    rare: "정원 수종 컬렉션",
    forest: "잣나무 숲길",
    zoneOverrides: { flower: "하경정원", forest: "잣나무숲길", rest: "전망쉼터" },
  }),
  createArboretum({
    id: "hantaek",
    name: "한택식물원",
    region: "경기 용인",
    description: "다양한 테마 정원과 식물 수집·보전 공간이 어우러진 민간 식물원입니다.",
    themes: ["희귀식물", "꽃", "사진"],
    aliases: ["용인", "경기", "한택", "식물원"],
    sourceLabel: "한택식물원 공식 홈페이지",
    sourceUrl: "https://www.hantaek.co.kr/",
    highlights: ["식물 수집·보전형 식물원", "희귀식물 관찰", "테마 정원 비교 관람"],
    visitTip: "희귀식물 테마를 선택하면 암석원과 희귀식물원을 함께 보며 식물 형태를 비교하기 좋습니다.",
    flower: "계절 초화",
    rare: "희귀식물 컬렉션",
    forest: "정원 숲길",
    zoneOverrides: { rare: "희귀식물원", flower: "계절꽃정원", wetland: "습지원" },
  }),
  createArboretum({
    id: "halla",
    name: "한라수목원",
    region: "제주 제주시",
    description: "제주의 자생식물과 난대림 산책을 도심 가까이에서 경험할 수 있는 수목원입니다.",
    themes: ["숲길", "희귀식물", "휴식", "꽃"],
    aliases: ["제주", "제주시", "한라", "자생식물"],
    sourceLabel: "한라수목원 공식 홈페이지",
    sourceUrl: "https://sumokwon.jeju.go.kr/",
    highlights: ["제주 자생식물", "난대림 산책", "도심 가까운 숲길 휴식"],
    visitTip: "제주 자생식물과 난대림 분위기를 느끼려면 숲길과 자생식물원을 함께 선택하는 코스가 어울립니다.",
    flower: "제주 야생화",
    rare: "제주 자생식물",
    forest: "난대림 산책길",
    zoneOverrides: { rare: "자생식물원", forest: "난대숲길", wetland: "생태연못" },
  }),
  createArboretum({
    id: "seoul-botanic",
    name: "서울식물원",
    region: "서울 강서",
    description: "도심에서 온실, 주제정원, 호수 산책을 함께 즐기는 식물 문화 공간입니다.",
    themes: ["사진", "꽃", "휴식", "희귀식물"],
    aliases: ["서울", "강서", "마곡", "온실", "호수"],
    sourceLabel: "서울식물원 공식 홈페이지",
    sourceUrl: "https://botanicpark.seoul.go.kr/",
    highlights: ["주제정원과 온실", "호수원·습지원 산책", "씨앗도서관과 식물문화 콘텐츠"],
    visitTip: "서울식물원은 열린숲, 호수원, 습지원과 주제원(온실·주제정원)이 나뉘므로 시간에 맞춰 실내외 비중을 조절해 보세요.",
    flower: "주제정원 초화",
    rare: "열대 온실식물",
    forest: "호수 산책길",
    zoneOverrides: { greenhouse: "온실", flower: "주제정원", forest: "숲문화길", wetland: "호수산책길" },
  }),
  createArboretum({
    id: "jade-garden",
    name: "제이드가든 수목원",
    region: "강원 춘천",
    description: "유럽풍 정원과 숲길 분위기가 강한 춘천의 정원형 수목원입니다.",
    themes: ["사진", "꽃", "숲길", "휴식"],
    aliases: ["춘천", "강원", "제이드", "유럽정원"],
    sourceLabel: "공개 백과 자료",
    sourceUrl: "https://en.wikipedia.org/wiki/Jade_Garden",
    highlights: ["유럽풍 정원 분위기", "사진 촬영 명소", "춘천 여행과 연계"],
    visitTip: "사진 테마라면 정원 축과 숲길을 함께 지나며 배경이 다른 장면을 모으는 코스를 추천합니다.",
    flower: "유럽풍 화단",
    rare: "정원 식물 컬렉션",
    forest: "숲속 산책로",
    zoneOverrides: { flower: "웨딩가든", forest: "스카이뷰길", rest: "가든쉼터" },
  }),
  createArboretum({
    id: "wando",
    name: "완도수목원",
    region: "전남 완도",
    description: "난대림과 남해안 숲 경관을 중심으로 걷기 좋은 전남 지역 수목원입니다.",
    themes: ["숲길", "휴식", "희귀식물", "사진"],
    aliases: ["완도", "전남", "난대림", "남해안"],
    sourceLabel: "전남 완도수목원 공개 정보",
    sourceUrl: "https://wando-arboretum.jeonnam.go.kr/",
    highlights: ["난대림 숲길", "남해안 산림 경관", "상록수림 관찰"],
    visitTip: "숲길과 휴식 테마가 잘 맞으며, 여름에는 그늘 동선 중심으로 관람하는 것이 좋습니다.",
    flower: "난대림 꽃나무",
    rare: "난대수종",
    forest: "상록수림길",
    zoneOverrides: { forest: "난대림숲길", rare: "난대식물원", rest: "숲속전망대" },
  }),
  createArboretum({
    id: "daegu",
    name: "대구수목원",
    region: "대구 달서",
    description: "도시 속 식물 전시와 산책을 함께 즐길 수 있는 대구의 대표 수목원입니다.",
    themes: ["꽃", "휴식", "사진", "숲길"],
    aliases: ["대구", "달서", "도심", "대구수목원"],
    sourceLabel: "대구수목원 공개 정보",
    sourceUrl: "https://www.daegu.go.kr/",
    highlights: ["도심형 수목원", "계절 화단", "가벼운 가족 산책"],
    visitTip: "짧은 시간 방문이라면 화목원과 전시온실, 잔디광장을 연결하는 가벼운 코스가 적합합니다.",
    flower: "계절 화단",
    rare: "전시 온실 식물",
    forest: "도심 숲길",
    zoneOverrides: { greenhouse: "전시온실", flower: "화목원", rest: "잔디광장" },
  }),
  createArboretum({
    id: "mulhyanggi",
    name: "물향기수목원",
    region: "경기 오산",
    description: "물과 숲을 주제로 한 경기도립 수목원으로 가족 산책과 휴식에 적합합니다.",
    themes: ["휴식", "숲길", "꽃", "사진"],
    aliases: ["오산", "경기", "경기도립", "물향기"],
    sourceLabel: "경기도 물향기수목원 공개 정보",
    sourceUrl: "https://farm.gg.go.kr/sigt/85",
    highlights: ["물과 숲 테마", "습지생태 관찰", "가족 산책에 좋은 동선"],
    visitTip: "아이와 함께라면 습지생태원과 숲길, 쉼터를 짧게 연결하는 코스가 편안합니다.",
    flower: "수변 꽃정원",
    rare: "수생식물",
    forest: "물향기 숲길",
    zoneOverrides: { wetland: "습지생태원", forest: "물향기숲길", flower: "물방울온실 주변정원" },
  }),
  createArboretum({
    id: "hwanghaksan",
    name: "황학산수목원",
    region: "경기 여주",
    description: "여주의 숲길과 전시정원을 중심으로 가볍게 걷기 좋은 수목원입니다.",
    themes: ["숲길", "꽃", "휴식"],
    aliases: ["여주", "경기", "황학산"],
    sourceLabel: "여주시 황학산수목원 공개 정보",
    sourceUrl: "https://www.yeoju.go.kr/",
    highlights: ["지역 숲길", "산림 초화원", "조용한 휴식형 관람"],
    visitTip: "숲길 중심의 편안한 수목원이라 30분 또는 60분 휴식 코스로 구성하기 좋습니다.",
    flower: "산림 초화원",
    rare: "지역 자생식물",
    forest: "황학산 숲길",
    zoneOverrides: { forest: "황학산숲길", flower: "항아리정원", rest: "산림쉼터" },
  }),
  createArboretum({
    id: "chollipo",
    name: "천리포수목원",
    region: "충남 태안",
    description:
      "충남 태안 천리포 바다와 숲이 어우러진 수목원으로, 주제원과 사계절 식물 관람, 가든스테이 콘텐츠가 돋보입니다.",
    themes: ["꽃", "희귀식물", "사진", "휴식", "숲길"],
    aliases: ["천리포", "태안", "충남", "충청남도", "바다", "가든스테이", "주제원", "목련", "민병갈"],
    sourceLabel: "천리포수목원 공식 홈페이지",
    sourceUrl: "https://www.chollipo.org/",
    mapImageUrl: "/images/chollipo-miller-map.png",
    mapImageAlt: "천리포수목원 밀러가든 안내도",
    highlights: ["천리포 바다와 숲 경관", "가든스테이", "사계절 식물 이야기와 주제원"],
    visitTip: "공식 홈페이지의 안내도, 주제원 사진, 지금 아름다운 식물 정보를 참고해 바다숲길과 주제원을 함께 보는 코스를 추천합니다.",
    flower: "천리포 사계절 꽃나무",
    rare: "목련과 수집식물",
    forest: "바다와 숲 산책길",
    zoneOverrides: {
      entrance: "입장안내",
      flower: "주제원",
      forest: "바다숲길",
      rare: "식물보전구역",
      greenhouse: "플랜트센터",
      wetland: "연못정원",
      rest: "가든스테이 쉼터",
    },
  }),
];
