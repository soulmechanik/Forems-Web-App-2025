"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/loadingScreen";
import LoginComponent from "./LoginComponent"; // move your LoginComponent to a separate file

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginComponent />
    </Suspense>
  );
}
