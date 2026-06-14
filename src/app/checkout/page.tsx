"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { trpc } from "@/trpc/client";
import ProtectedPage from "@/components/ProtectedPage";
import PageWrapper from "@/components/PageWrapper";

export default function CheckoutPage() {
  return (
    <ProtectedPage>
      <CheckoutContent />
    </ProtectedPage>
  );
}

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [done, setDone] = useState(false);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      clearCart();
      setDone(true);
    },
  });

  if (done) {
    return (
      <PageWrapper>
        <div className="nes-container is-success with-title text-center">
          <p className="title text-xs">SUCCESS!</p>
          <p className="text-xs mb-4">
            Your order is complete. Games added to your library!
          </p>
          <button
            onClick={() => router.push("/library")}
            className="nes-btn is-success text-xs"
          >
            GO TO LIBRARY
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="nes-container is-dark with-title mb-8">
        <p className="title text-xs">CHECKOUT</p>
        <p className="text-xs">Review your order and complete payment.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <section className="nes-container is-dark with-title">
          <p className="title text-xs">ORDER SUMMARY</p>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="nes-container is-rounded bg-white p-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-bold">{item.title}</p>
                  <p className="text-xs text-gray-600">One-time purchase</p>
                </div>
                <p className="text-xs font-bold text-green-700">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-right">
            TOTAL: ${total.toFixed(2)}
          </p>
        </section>

        <section className="nes-container is-dark with-title">
          <p className="title text-xs">PAYMENT</p>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-xs font-bold mb-1"
              >
                Card
              </label>
              <input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                disabled
                className="w-full border-2 border-black px-2 py-1 text-xs bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="expiry"
                  className="block text-xs font-bold mb-1"
                >
                  Expiry
                </label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="w-full border-2 border-black px-2 py-1 text-xs bg-white"
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-xs font-bold mb-1">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  disabled
                  className="w-full border-2 border-black px-2 py-1 text-xs bg-white"
                />
              </div>
            </div>
            <button
              onClick={() =>
                createOrder.mutate({
                  items: items.map((i) => ({ gameId: i.id, price: i.price })),
                })
              }
              disabled={createOrder.isPending}
              className={`w-full nes-btn text-xs ${createOrder.isPending ? "is-disabled" : "is-success"}`}
            >
              {createOrder.isPending
                ? "PROCESSING..."
                : `PAY $${total.toFixed(2)}`}
            </button>
            {createOrder.isError && (
              <p className="text-xs text-red-700 font-bold">
                {createOrder.error.message}
              </p>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
