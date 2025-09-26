"use client";
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "@/components/loadingScreen";

const roleConfigMap = {
  landlord: { emoji: "🏠", color: "#2563EB" },
  tenant: { emoji: "🛋️", color: "#10B981" },
  agent: { emoji: "🕵️‍♂️", color: "#F59E0B" },
  propertyManager: { emoji: "📋", color: "#8B5CF6" },
};

export default function AuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Only render session-dependent content after component mounts
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    let progressInterval;

    async function handleRedirect() {
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => (prev >= 90 ? prev : prev + 1));
      }, 25);

      // Wait until session is resolved
      if (status === "loading") return;

      const user = session?.user;

      if (!user?._id) {
        if (status === "unauthenticated") {
          toast.error("You need to log in first!");
        }
        router.replace("/login");
        clearInterval(progressInterval);
        return;
      }

      let destination = "/onboard";
      switch (user.lastActiveRole) {
        case "landlord":
          destination = "/dashboard/landlord";
          break;
        case "tenant":
          destination = user.hasActiveTenancy
            ? "/dashboard/tenant"
            : "/dashboard/tenant/start";
          break;
        case "propertyManager":
          destination = "/dashboard/manager";
          break;
        case "agent":
          destination = "/dashboard/agent";
          break;
        default:
          destination = "/onboard";
      }

      const roleSwitched = sessionStorage.getItem("roleSwitched");
      if (roleSwitched) {
        const config = roleConfigMap[roleSwitched] || {};
        toast.custom(
          (t) => (
            <div
              className="px-4 py-2 rounded-lg shadow-lg text-white font-semibold flex items-center"
              style={{ backgroundColor: config.color || "#111" }}
            >
              <span className="mr-2">{config.emoji || "🎉"}</span>
              <span>{`Hey ${user.name || "there"}, you're now a ${roleSwitched}!`}</span>
            </div>
          ),
          { id: "role-switched", duration: 3000 }
        );
        sessionStorage.removeItem("roleSwitched");
      }

      if (window.location.pathname !== destination) {
        setTimeout(() => router.replace(destination), 500);
      }

      setLoadingProgress(100);
      clearInterval(progressInterval);
    }

    handleRedirect();

    return () => clearInterval(progressInterval);
  }, [router, session, status, isReady]);

  // Show minimal loading during SSR and initial client render
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <LoadingScreen
        loadingProgress={loadingProgress}
        title="🚀 Teleporting You"
        subtitle="Hold tight... calibrating warp drive!"
      />
    </>
  );
}