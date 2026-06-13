'use client'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/index'

// tutaj eksportowany jest klient trpc dla reacta

export const trpc = createTRPCReact<AppRouter>()