import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { CharacterScene } from "@/components/ui/animated-characters-login";
import { Checkbox } from "@/components/ui/checkbox";
import { apiLogin, apiSignup } from "@/lib/api";
import { BACKEND_ORIGIN } from "@/lib/config";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to MediRush — Your health, delivered fast" },
      { name: "description", content: "Log in or create your MediRush account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleOAuth, setGoogleOAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/oauth-status")
      .then((r) => r.json())
      .then((data) => setGoogleOAuth(Boolean(data.googleOAuth)))
      .catch(() => setGoogleOAuth(false));
  }, []);

  // ✅ KEY FIX: Detect Google OAuth callback on this same page
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const userName = url.searchParams.get("name");
    const userEmail = url.searchParams.get("email");
    const errorParam = url.searchParams.get("error");

    if (errorParam) {
      setError("Google sign-in failed. Please try again.");
      // Clean the URL
      window.history.replaceState({}, "", "/auth");
      return;
    }

    if (token && userName && userEmail) {
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: decodeURIComponent(userName),
          email: decodeURIComponent(userEmail),
        })
      );
      // Go to dashboard
      navigate({ to: "/", replace: true });
    }
  }, []);

  const switchMode = (m: "login" | "signup") => {
    setMode(m);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await apiLogin(email, password);
        navigate({ to: "/" });
      } else {
        await apiSignup(name, email, password);
        switchMode("login");
        setSuccess("Account created successfully! Please sign in.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left: hero */}
      <section className="relative hidden overflow-hidden bg-gradient-navy lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.78_0.14_195/0.25),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-background">
          <Link to="/auth" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-teal shadow-glow">
              <Zap className="h-5 w-5 text-navy" strokeWidth={2.5} />
            </span>
            <span className="font-display text-2xl font-bold">
              Medi<span className="text-teal-glow">Rush</span>
            </span>
          </Link>

          <div className="relative my-8 flex flex-1 items-center justify-center">
            <CharacterScene
              isTyping={isTyping}
              passwordLength={password.length}
              showPassword={showPassword}
            />
          </div>

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Your health,<br />delivered <span className="text-teal-glow">fast.</span>
            </h1>
            <p className="mt-3 text-sm text-background/70">
              Tip: type the password — they'll get curious. Click the eye to show it and watch the teal one peek 👀
            </p>
          </div>
        </div>
      </section>

      {/* Right: form */}
      <section className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-2xl font-bold text-foreground">
              Medi<span className="text-teal">Rush</span>
            </span>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Sign in to continue your order." : "Start ordering in under a minute."}
          </p>

          {/* Toggle */}
          <div className="mt-6 inline-flex rounded-2xl border border-border bg-secondary/60 p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`relative px-5 py-2 text-sm font-semibold transition ${
                  mode === m ? "text-navy" : "text-muted-foreground"
                }`}
              >
                {mode === m && (
                  <span className="absolute inset-0 rounded-xl bg-gradient-teal shadow-glow" />
                )}
                <span className="relative">{m === "login" ? "Login" : "Sign Up"}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                icon={User}
                label="Full name"
                placeholder="Aarav Reddy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            )}

            <Field
              icon={Mail}
              label="Email"
              placeholder="you@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              required
            />

            <PasswordField
              label="Password"
              value={password}
              onChange={(v) => setPassword(v)}
              show={showPassword}
              onToggle={() => setShowPassword((s) => !s)}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />

            {mode === "signup" && (
              <PasswordField
                label="Confirm password"
                value={confirmPassword}
                onChange={(v) => setConfirmPassword(v)}
                show={showPassword}
                onToggle={() => setShowPassword((s) => !s)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
              />
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Checkbox id="remember" className="h-4 w-4" />
                  Remember me for 30 days
                </label>
                <button type="button" className="text-xs font-semibold text-teal hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-teal/30 bg-teal/10 px-4 py-2.5 text-xs font-semibold text-teal">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-teal py-3.5 text-sm font-bold text-navy shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
              {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
            </button>
          </form>

          {googleOAuth && (
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
            </div>
          )}

          {googleOAuth && (
            <a
              href={`${BACKEND_ORIGIN}/api/auth/google`}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition hover:border-teal"
            >
              <GoogleIcon />
              Continue with Google
            </a>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  ...rest
}: { icon: typeof Mail; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          {...rest}
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
        />
      </div>
    </label>
  );
}

function PasswordField({
  label, value, onChange, show, onToggle, onFocus, onBlur,
}: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="••••••••"
          required
          className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.63z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.36 0-4.36-1.59-5.07-3.74H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.93 10.68A5.4 5.4 0 0 1 3.64 9c0-.58.1-1.14.29-1.68V4.99H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.01l2.97-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.99L3.93 7.32C4.64 5.17 6.64 3.58 9 3.58z"/>
    </svg>
  );
}