"use client";
import { useCart } from "@/context/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedPage from "@/components/ProtectedPage";
import PageWrapper from "@/components/PageWrapper";

export default function CartPage() {
  return (
    <ProtectedPage>
      <CartContent />
    </ProtectedPage>
  );
}

function CartContent() {
  const { items, removeItem, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <PageWrapper>
        <div className="nes-container is-dark with-title text-center">
          <p className="title">EMPTY CART</p>
          <p className="text-xs mb-4">
            Your cart is empty. Load up with PC games!
          </p>
          <Link href="/shop/games" className="nes-btn is-primary">
            BROWSE GAMES
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <PageWrapper>
      <section className="nes-container is-dark with-title mb-8">
        <p className="title">YOUR CART</p>
        <p className="text-xs mb-4">
          Review your selections and continue to checkout.
        </p>
      </section>

      <div className="space-y-2 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="nes-container is-rounded bg-white flex justify-between items-center p-3"
          >
            <div>
              <p className="text-xs font-bold">{item.title}</p>
              <p className="text-xs text-green-700">${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="nes-btn is-error text-xs"
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>

      <section className="nes-container is-dark with-title">
        <p className="title">TOTAL</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold">${total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="nes-btn is-success text-xs"
          >
            CHECKOUT
          </button>
        </div>
      </section>
    </PageWrapper>
  );
}
