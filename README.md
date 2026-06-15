# BloomTrail

국내 수목원 검색 기반 맞춤 관람 코스 추천 웹서비스입니다.

사용자는 국내 수목원을 검색하고, 관람 시간·관심 테마·동행 유형을 선택해 추천 관람 코스와 내부 미니맵을 확인할 수 있습니다. Supabase Auth를 이용한 로그인/회원가입과 사용자별 코스 저장 기능을 포함합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase RLS
- Vercel 배포 구조

## 실행 방법

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 접속합니다.

```txt
http://localhost:3000
```

3000번 포트가 사용 중이면 터미널에 표시되는 다른 포트로 접속합니다.

## 환경 변수

`.env.local`에 아래 값을 넣어야 합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=Supabase_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase_Anon_Key
```

`.env.local`은 GitHub에 올리면 안 됩니다. Vercel 배포 시에는 Vercel Dashboard의 Environment Variables에 같은 값을 등록합니다.

## Supabase DB 설정

Supabase SQL Editor에서 아래 파일 내용을 실행합니다.

```txt
supabase/saved_routes.sql
```

이 SQL은 `saved_routes` 테이블과 사용자별 데이터 보호를 위한 RLS 정책을 생성합니다.

## 검증

```bash
npm.cmd run typecheck
npm.cmd run build
```
