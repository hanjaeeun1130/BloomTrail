import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <section className="auth-page">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </section>
  );
}
