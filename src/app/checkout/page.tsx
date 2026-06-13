"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { trpc } from "@/trpc/client";
import ProtectedPage from "@/components/ProtectedPage";

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

  // jeśli użytkownik nie jest zalogowany, przekieruj

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      clearCart();
      setDone(true);
    },
  });

  if (done) {
    return (
      <main>
        <h1>Order confirmed!</h1>
        <p>Your games are now in your library.</p>
        <button onClick={() => router.push("/library")}>Go to Library</button>
      </main>
    );
  }

  return (
    <main>
      <h1>Checkout</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>

      <h2>Payment details</h2>
      <p style={{ color: "gray", fontSize: "0.9rem" }}>
        Simulated payment — no real charge
      </p>
      <div>
        <label htmlFor="cardNumber">Card number</label>
        <input
          id="cardNumber"
          type="text"
          placeholder="1234 5678 9012 3456"
          disabled
        />
      </div>
      <div>
        <label htmlFor="expiry">Expiry</label>
        <input id="expiry" type="text" placeholder="MM/YY" disabled />
      </div>
      <div>
        <label htmlFor="cvc">CVC</label>
        <input id="cvc" type="text" placeholder="123" disabled />
      </div>

      <button
        onClick={() =>
          createOrder.mutate({
            items: items.map((i) => ({ gameId: i.id, price: i.price })),
          })
        }
        disabled={createOrder.isPending}
      >
        {createOrder.isPending ? "Processing..." : "Pay $" + total.toFixed(2)}
      </button>

      {createOrder.isError && (
        <p style={{ color: "red" }}>{createOrder.error.message}</p>
      )}
    </main>
  );
}
