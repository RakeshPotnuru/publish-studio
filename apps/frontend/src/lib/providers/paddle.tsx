"use client";

import { useEffect } from "react";

import { initializePaddle } from "@paddle/paddle-js";

import useUserStore from "../stores/user";

export default function PaddleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      environment:
        process.env.NEXT_PUBLIC_SITE_ENV === "production"
          ? "production"
          : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      pwCustomer: {
        email: user?.email,
        id: user?.customer_id,
      },
    }).catch(() => {
      // Ignore
    });
  }, [user]);

  return children;
}
