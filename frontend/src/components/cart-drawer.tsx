import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/cart-context";

const DELIVERY_FEE = 40;

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-navy-deep/60 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-soft transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Your Cart</h2>
            <p className="text-xs text-muted-foreground">{items.length} item{items.length !== 1 && "s"}</p>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-foreground hover:border-teal hover:text-teal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-teal/20 to-transparent">
              <ShoppingBag className="h-10 w-10 text-teal" />
            </div>
            <h3 className="mt-6 font-display text-xl font-bold text-foreground">Your cart is empty</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Add medicines you need and we'll deliver them in 30 minutes.
            </p>
            <button
              onClick={close}
              className="mt-6 rounded-2xl bg-gradient-teal px-6 py-3 text-sm font-semibold text-navy shadow-glow transition hover:scale-[1.02]"
            >
              Browse Medicines
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 rounded-2xl border border-border bg-background p-3">
                  <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${it.accent} text-2xl`}>
                    {it.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-foreground">{it.name}</p>
                    <p className="text-xs text-muted-foreground">{it.brand}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-border">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-teal"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-teal"
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold text-foreground">₹{it.price * it.qty}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    aria-label="Remove"
                    className="self-start text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border bg-secondary/40 px-6 py-5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery fee</span>
                  <span>₹{DELIVERY_FEE}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{subtotal + DELIVERY_FEE}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                onClick={close}
                className="mt-4 block rounded-2xl bg-gradient-teal py-3.5 text-center text-sm font-semibold text-navy shadow-glow transition hover:scale-[1.01]"
              >
                Proceed to Checkout →
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}