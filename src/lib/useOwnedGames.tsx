import { trpc } from "@/trpc/client";
import { useAuth } from "@/context/auth";

export function useOwnedGames(): Set<string> {
  const { isLoggedIn } = useAuth();

  const { data: orders } = trpc.orders.list.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  if (!orders) return new Set();

  // id gier na podstawie zamówień użytkownika
  return new Set(orders.flatMap((o) => o.items.map((i) => i.gameId)));
}
