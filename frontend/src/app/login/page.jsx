'use client';

import { Suspense } from "react";
import { SessionProvider } from 'next-auth/react';
import Loading from "@/components/loadingScreen";
import LoginComponent from "./LoginComponent";

export default function LoginPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<Loading />}>
        <LoginComponent />
      </Suspense>
    </SessionProvider>
  );
}