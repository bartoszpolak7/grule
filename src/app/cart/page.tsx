"use client";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, total } = useCart();
  const { accessToken } = useAuth();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <main>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/shop/games">Browse games</Link>
      </main>
    );
  }

  const handleCheckout = () => {
    if (!accessToken) {
      router.push("/auth/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <main>
      <h1>Your Cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </main>
  );
}
