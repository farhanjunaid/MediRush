import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Pill, Search, ShoppingCart, ChevronDown, LogOut, Package } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";
import { getUser, apiLogout } from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";

export function Navbar() {
  const { count, open } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]);

  // ✅ Hide navbar on ALL auth-related pages
  const isAuthPage = location.pathname.startsWith("/auth");
  if (isAuthPage) return null;

  const initials = user?.name
    ? user.name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSignOut = () => {
    apiLogout();
    setMenuOpen(false);
    navigate({ to: "/auth" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-teal shadow-glow">
            <Pill className="h-5 w-5 text-navy" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Medi<span className="text-teal">Rush</span>
          </span>
        </Link>

        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search medicines, brands, symptoms..."
            className="h-11 w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>

        <button
          onClick={open}
          aria-label="Open cart"
          className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card text-foreground transition hover:border-teal hover:text-teal"
        >
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-teal px-1 text-[11px] font-bold text-navy shadow-glow">
              {count}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-2xl border border-border bg-card px-2 py-1.5 transition hover:border-teal"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-navy text-xs font-bold text-teal-glow">
              {initials}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name ?? "Guest"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "Not logged in"}
                </p>
              </div>

              <button className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-foreground hover:bg-secondary">
                <Package className="h-4 w-4 text-muted-foreground" />
                My Orders
              </button>

              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-destructive hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="border-t border-border/60 px-4 pb-3 pt-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search medicines..."
            className="h-10 w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
        </div>
      </div>
    </header>
  );
}