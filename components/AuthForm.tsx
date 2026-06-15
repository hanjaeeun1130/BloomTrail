"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!isSupabaseConfigured()) {
      setMessage(".env.local에 Supabase URL과 ANON KEY를 먼저 입력해 주세요.");
      setIsLoading(false);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage("로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.");
        setIsLoading(false);
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/mypage";
      router.push(redirectTo);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage("회원가입에 실패했습니다. 입력값을 확인해 주세요.");
      setIsLoading(false);
      return;
    }

    setMessage("회원가입이 완료되었습니다. Supabase 설정에 따라 인증 메일을 확인한 뒤 로그인해 주세요.");
    setPassword("");
    setIsLoading(false);
  }

  return (
    <div className="auth-card">
      <p className="section-label">{mode === "login" ? "Login" : "Sign Up"}</p>
      <h1>{mode === "login" ? "BloomTrail 로그인" : "BloomTrail 회원가입"}</h1>
      <p className="auth-copy">
        이메일과 비밀번호는 직접 저장하지 않고 Supabase Auth로 안전하게 처리합니다.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input
            required
            type="email"
            value={email}
            placeholder="bloom@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          비밀번호
          <input
            required
            minLength={6}
            type="password"
            value={password}
            placeholder="6자 이상 입력"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
        </button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <p className="auth-link">
        {mode === "login" ? (
          <>
            계정이 없나요? <Link href="/signup">회원가입하기</Link>
          </>
        ) : (
          <>
            이미 계정이 있나요? <Link href="/login">로그인하기</Link>
          </>
        )}
      </p>
    </div>
  );
}
