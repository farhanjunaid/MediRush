import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Read directly from window.location since TanStack Router
    // may not expose search params on this route easily
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const name = url.searchParams.get("name");
    const email = url.searchParams.get("email");
    const error = url.searchParams.get("error");

    if (error || !token || !name || !email) {
      navigate({ to: "/auth", replace: true });
      return;
    }

    // ✅ Save exactly like email login
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
      })
    );

    // ✅ Replace history so back button doesn't go back to callback
    navigate({ to: "/", replace: true });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
}