# 🥔 Grule — Sklep z grami dla ziemniaczanych PC

> _„Odpali nawet na ziemniaku"_

**Projekt zaliczeniowy — Projektowanie Aplikacji Internetowych 2025/26**
Bartosz Polak · Uniwersytet Jagielloński · WFAiIS · Instytut Informatyki Stosowanej

---

## Cel projektu

System ma pomóc graczom posiadającym słabszy sprzęt w sytuacji niepohamowanego wzrostu cen komponentów komputerowych podjąć decyzję o wyborze i kupnie odpowiedniej dla siebie gry na podstawie ich specyfikacji, opisu oraz ocen w czasie dowolnym (najlepiej spokojnym popołudniem).

Grule to sklep internetowy z grami PC, który pozwala użytkownikom przeglądać katalog gier wzbogacony o dane z zewnętrznego API (RAWG.io), filtrować gry według wymagań sprzętowych (RAM, dysk, karta graficzna), kupować gry i zarządzać swoją biblioteką.

---

## Uruchomienie

### Pełny stack (produkcja)

```bash
docker compose up
```

Uruchamia bazę danych PostgreSQL, aplikację Next.js oraz automatycznie:

- wykonuje migracje bazy danych (`prisma migrate deploy`)
- seeduje bazę przykładowymi grami (`prisma/seed.ts`)
  Aplikacja dostępna pod: [http://localhost:3000](http://localhost:3000)

### Lokalny development (z hot reload)

```bash
docker compose up db -d
npm run dev
```

Aplikacja dostępna pod: [http://localhost:3000](http://localhost:3000)

### Wymagania

- Docker i Docker Compose
- Node.js 20+ (tylko do lokalnego developmentu)

---

## Funkcjonalności

### Dla gościa (niezalogowany)

- Przeglądanie katalogu gier z wyszukiwarką i filtrami
- Wyświetlanie szczegółów gry: opis, oceny, screenshoty, wymagania sprzętowe
- Filtrowanie gier według gatunku, ceny, RAM, miejsca na dysku
- Filtr **🥔 Potato PC Only** — pokazuje wyłącznie gry działające na zintegrowanej grafice
- Rejestracja i logowanie

### Dla zalogowanego użytkownika

- Dodawanie gier do koszyka
- Symulowany proces zakupu (checkout)
- Biblioteka zakupionych gier z podglądem szczegółów
- Ochrona przed ponownym zakupem już posiadanej gry

---

## Architektura

```
grule/
├── prisma/
│   ├── schema.prisma        # schemat bazy danych
│   ├── migrations/          # historia migracji
│   └── seed.ts              # dane startowe
├── src/
│   ├── app/                 # strony Next.js (App Router)
│   │   ├── api/trpc/        # endpoint tRPC
│   │   ├── auth/            # logowanie i rejestracja
│   │   ├── shop/games/      # katalog i szczegóły gier
│   │   ├── cart/            # koszyk
│   │   ├── checkout/        # płatność (symulowana)
│   │   └── library/         # biblioteka użytkownika
│   ├── server/
│   │   ├── trpc.ts          # inicjalizacja tRPC, kontekst, middleware
│   │   └── routers/         # procedury: auth, games, orders
│   ├── context/             # AuthContext, CartContext
│   ├── components/          # GameCard, GameSearch, Navbar, ProtectedPage
│   ├── lib/                 # prisma.ts, auth.ts, rawg.ts, parseSpecs.ts
│   └── trpc/                # klient tRPC, provider
├── Dockerfile
└── compose.yaml
```

### Stack technologiczny

| Warstwa        | Technologia                                     |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router)                         |
| Język          | TypeScript (strict)                             |
| API            | tRPC v11                                        |
| Baza danych    | PostgreSQL 18                                   |
| ORM + migracje | Prisma 7                                        |
| Autentykacja   | JWT (access token 15 min + refresh token 7 dni) |
| Style          | Tailwind CSS v4 + NES.css                       |
| Stan serwera   | TanStack Query (via @trpc/react-query)          |
| Zewnętrzne API | RAWG.io                                         |
| Konteneryzacja | Docker + Docker Compose                         |

---

## Decyzje architektoniczne (ADR)

Dokumentacja decyzji architektonicznych znajduje się w pliku [`ADR.md`](./ADR.md).

---

## Integracja z RAWG.io

Dane o grach pochodzą z dwóch źródeł:

- **Baza danych** — cena, dostępność w sklepie, `rawgId`
- **RAWG.io API** — tytuł, opis, gatunki, oceny, screenshoty, wymagania sprzętowe

### Strategia cachowania

| Dane                                  | Mechanizm                           | TTL             |
| ------------------------------------- | ----------------------------------- | --------------- |
| Wymagania sprzętowe, gatunek, obrazek | Zapis do DB przy pierwszym pobraniu | Permanentny     |
| Oceny, screenshoty, opis              | Next.js fetch cache (`revalidate`)  | 24h (produkcja) |

Wymagania sprzętowe są parsowane z tekstowego pola RAWG (np. `"Memory: 2 GB, Hard Disk Space: 1 GB"`) za pomocą wyrażeń regularnych (`src/lib/parseSpecs.ts`) i zapisywane do bazy przy pierwszej wizycie na stronie gry.

---

## Baza danych

### Modele

- `User` — email, hasło (bcrypt), rola
- `Game` — tytuł, cena, gatunki[], rawgId, wymagania sprzętowe
- `Order` + `OrderItem` — historia zakupów powiązana z użytkownikiem
- `RefreshToken` — aktywne sesje użytkownika

---

## Autoryzacja

Aplikacja używa dwutokenowego schematu JWT:

```
POST /api/trpc/auth.login
  → access token (15 min)
  → refresh token (7 dni)

Oba tokeny są httpOnly cookies.

POST /api/trpc/auth.refresh (przy starcie aplikacji)
  → nowy access token jeśli refresh token jest ważny

POST /api/trpc/auth.logout
  → usuwa wiersz refresh tokenu z bazy
  → czyści cookie
```

---

## Elementy dodatkowe

| Element              | Realizacja                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Cache**            | Next.js fetch cache (24h TTL) + lazy DB population dla danych ze sprzętowych z RAWG                               |
| **Walidacja danych** | Zod na wejściu wszystkich procedur tRPC (email, hasło, dane zamówienia)                                           |
| **Seed data**        | `prisma/seed.ts` — idempotentny skrypt seedujący gry z `rawgId`, uruchamiany automatycznie przy starcie kontenera |

---

## Znane ograniczenia

- Refresh token nie jest rotowany przy każdym odświeżeniu (jedna aktywna sesja na użytkownika)
- Wymagania sprzętowe parsowane są z tekstu - dla gier bez danych PC w RAWG wyświetlane jest „Brak informacji", POTATO ONLY DZIAŁA BARDZO SŁABO
