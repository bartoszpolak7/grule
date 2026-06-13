"use client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/index";

// interfejs klienta do korzystania z TRPC, tworzy schemat na podstawie backendu
export const trpc = createTRPCReact<AppRouter>();
