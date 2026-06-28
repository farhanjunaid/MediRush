import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Filter, Plus, Search, Sparkles, Truck, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { fetchMedicines, isLoggedIn } from "@/lib/api";
import type { Medicine } from "@/data/medicines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediRush — Order medicines, delivered in 30 minutes" },
      { name: "description", content: "Browse pain relief, vitamins, antibiotics, skincare and more." },
      { property: "og:title", content: "MediRush Dashboard" },
      { property: "og:description", content: "Get medicines delivered in 30 minutes." },
    ],
  }),
  component: HomePage,
});

type APIMedicine = Medicine & { _id: string };

const CATEGORIES = ["Pain Relief", "Vitamins", "Antibiotics", "Skincare", "Diabetes", "Cold & Flu"];

function HomePage() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(700);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [medicines, setMedicines] = useState<APIMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fix 1: Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate({ to: "/auth" });
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) return; // don't fetch if not logged in
    setLoading(true);
    setError("");
    fetchMedicines({
      category: activeCat,
      inStock: inStockOnly || undefined,
      maxPrice: maxPrice < 700 ? maxPrice : undefined,
      search: query || undefined,
    })
      .then((data) => setMedicines(data))
      .catch(() => setError("Failed to load medicines. Is your backend running?"))
      .finally(() => setLoading(false));
  }, [activeCat, inStockOnly, maxPrice, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      {/* Hero */}
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-navy p-8 text-background shadow-soft sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal/40 blur-3xl" />
        <div className="absolute bottom-0 right-12 hidden text-[180px] leading-none opacity-20 lg:block">💊</div>
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal-glow">
            <Sparkles className="h-3 w-3" /> Express Health
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
            Get medicines delivered<br />
            in <span className="text-teal-glow">30 minutes</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-background/70 sm:text-base">
            Verified pharmacies. Real prices. No hidden fees. Order from over 10,000 medicines.
          </p>
          <div className="mt-6 flex max-w-lg items-center gap-2 rounded-2xl bg-background/95 p-1.5 shadow-soft">
            <Search className="ml-3 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Paracetamol, Vitamin D…"
              className="flex-1 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button className="flex items-center gap-1.5 rounded-xl bg-gradient-teal px-4 py-2.5 text-xs font-bold text-navy shadow-glow">
              <Truck className="h-3.5 w-3.5" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCat === c
                  ? "border-transparent bg-gradient-teal text-navy shadow-glow"
                  : "border-border bg-card text-foreground hover:border-teal hover:text-teal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Layout */}
      <section className="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <FilterPanel
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
          />
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{medicines.length}</span> medicines
              {activeCat !== "All" && ` in ${activeCat}`}
            </p>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-sm font-semibold lg:hidden"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-destructive/10 px-5 py-4 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-3xl bg-secondary" />
              ))}
            </div>
          ) : medicines.length === 0 && !error ? (
            <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <p className="font-display text-lg font-bold text-foreground">No medicines found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {medicines.map((m) => (
                <MedicineCard key={m._id} m={m} />
              ))}
            </div>
          )}

          {!loading && !error && medicines.length > 0 && (
            <div className="mt-10 text-center text-xs text-muted-foreground">
              Showing all available medicines • More coming soon
            </div>
          )}
        </div>
      </section>

      {/* Mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-border">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
            />
          </div>
        </div>
      )}
    </main>
  );
}

function MedicineCard({ m }: { m: APIMedicine }) {
  const { add } = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    if (!isLoggedIn()) {
      navigate({ to: "/auth" });
      return;
    }
    add(m); // m.id already set by api.ts (_id → id mapping)
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:border-teal/60 hover:shadow-soft">
      <div className={`relative grid h-40 place-items-center bg-gradient-to-br ${m.accent}`}>
        <span className="text-6xl drop-shadow-sm">{m.emoji}</span>
        {!m.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
            Out of stock
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur">
          {m.category}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.brand}</p>
        <h3 className="mt-1 line-clamp-1 font-display text-base font-bold text-foreground">{m.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-foreground">₹{m.price}</span>
          <button
            onClick={handleAdd}
            disabled={!m.inStock}
            className="flex items-center gap-1 rounded-xl bg-gradient-teal px-3 py-2 text-xs font-bold text-navy shadow-glow transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}

function FilterPanel({
  maxPrice, setMaxPrice, inStockOnly, setInStockOnly, activeCat, setActiveCat,
}: {
  maxPrice: number; setMaxPrice: (n: number) => void;
  inStockOnly: boolean; setInStockOnly: (b: boolean) => void;
  activeCat: string; setActiveCat: (c: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-base font-bold text-foreground">Refine</h3>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
        <div className="flex flex-col gap-1">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                activeCat === c ? "bg-secondary font-semibold text-teal" : "text-foreground hover:bg-secondary/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max price</p>
          <span className="text-sm font-bold text-foreground">₹{maxPrice}</span>
        </div>
        <input
          type="range" min={50} max={700} step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-teal"
        />
      </div>

      <label className="mt-6 flex cursor-pointer items-center justify-between rounded-2xl bg-secondary/60 p-3">
        <span className="text-sm font-semibold text-foreground">In stock only</span>
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`relative h-6 w-11 rounded-full transition ${inStockOnly ? "bg-gradient-teal" : "bg-border"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-card transition ${inStockOnly ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </label>
    </div>
  );
}