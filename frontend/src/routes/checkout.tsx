import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Banknote, Check, CreditCard, Smartphone, Truck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { placeOrder, isLoggedIn } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — MediRush" },
      { name: "description", content: "Confirm your delivery address and payment to place your MediRush order." },
    ],
  }),
  component: CheckoutPage,
});

const DELIVERY_FEE = 40;

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [pay, setPay] = useState<"cod" | "upi" | "card">("upi");
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Form refs
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const address1Ref = useRef<HTMLInputElement>(null);
  const address2Ref = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const pincodeRef = useRef<HTMLInputElement>(null);

  if (items.length === 0 && !placed) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add medicines before checking out.</p>
        <Link to="/" className="mt-6 inline-block rounded-2xl bg-gradient-teal px-6 py-3 text-sm font-bold text-navy shadow-glow">
          Browse Medicines
        </Link>
      </main>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn()) {
      navigate({ to: "/auth" });
      return;
    }

    const paymentMap = { upi: "UPI", card: "Card", cod: "Cash on Delivery" } as const;

    const payload = {
      items: items.map((i) => ({
        medicine: (i as any)._id ?? i.id,
        name: i.name,
        price: i.price,
        quantity: i.qty,
      })),
      deliveryAddress: {
        fullName: fullNameRef.current?.value ?? "",
        phone: phoneRef.current?.value ?? "",
        addressLine1: address1Ref.current?.value ?? "",
        addressLine2: address2Ref.current?.value ?? "",
        city: cityRef.current?.value ?? "",
        pincode: pincodeRef.current?.value ?? "",
      },
      paymentMethod: paymentMap[pay],
      subtotal,
      total: subtotal + DELIVERY_FEE,
    };

    setLoading(true);
    try {
      await placeOrder(payload);
      setPlaced(true);
      setTimeout(() => clear(), 400);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Link to="/" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-teal">
          ← Continue shopping
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">Almost there. Confirm your details below.</p>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left */}
        <div className="space-y-6">
          <Card title="Delivery address" subtitle="We'll deliver here in ~30 minutes.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input ref={fullNameRef} label="Full name" placeholder="Aarav Reddy" required />
              <Input ref={phoneRef} label="Phone" placeholder="+91 98765 43210" required />
              <Input ref={address1Ref} label="Address line 1" placeholder="Flat / House no." required className="sm:col-span-2" />
              <Input ref={address2Ref} label="Address line 2" placeholder="Street, area" className="sm:col-span-2" />
              <Input ref={cityRef} label="City" placeholder="Bengaluru" required />
              <Input ref={pincodeRef} label="Pincode" placeholder="560001" required />
            </div>
          </Card>

          <Card title="Payment method" subtitle="Choose how you'd like to pay.">
            <div className="grid gap-3 sm:grid-cols-3">
              <PayPill icon={Smartphone} label="UPI" value="upi" active={pay === "upi"} onClick={() => setPay("upi")} />
              <PayPill icon={CreditCard} label="Card" value="card" active={pay === "card"} onClick={() => setPay("card")} />
              <PayPill icon={Banknote} label="Cash on Delivery" value="cod" active={pay === "cod"} onClick={() => setPay("cod")} />
            </div>
          </Card>

          {error && (
            <div className="rounded-2xl bg-destructive/10 px-5 py-3 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Order summary</h2>

            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${i.accent} text-xl`}>
                    {i.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{i.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
                  </div>
                  <span className="text-sm font-bold">₹{i.price * i.qty}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={`₹${subtotal}`} />
              <Row label="Delivery fee" value={`₹${DELIVERY_FEE}`} />
              <Row label="Grand total" value={`₹${subtotal + DELIVERY_FEE}`} bold />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-teal py-3.5 text-sm font-bold text-navy shadow-glow transition hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" /> Estimated delivery in 30 min
            </p>
          </div>
        </aside>
      </form>

      {/* Success modal */}
      {placed && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-deep/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card p-8 text-center shadow-soft">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-teal animate-pulse-glow">
              <Check className="h-10 w-10 text-navy" strokeWidth={3} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold text-foreground">Order placed!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your medicines will arrive in approximately{" "}
              <span className="font-bold text-teal">30 minutes</span>.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="mt-6 w-full rounded-2xl bg-gradient-teal py-3 text-sm font-bold text-navy shadow-glow"
            >
              Back to home
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const Input = ({ label, className = "", ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
    <input
      {...rest}
      className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
    />
  </label>
);

function PayPill({ icon: Icon, label, active, onClick }: { icon: typeof Banknote; label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
        active ? "border-teal bg-gradient-to-br from-teal/15 to-transparent shadow-glow" : "border-border bg-background hover:border-teal/50"
      }`}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-gradient-teal text-navy" : "bg-secondary text-foreground"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </button>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "border-t border-border pt-2 font-display text-base font-bold text-foreground" : "text-muted-foreground"}`}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}