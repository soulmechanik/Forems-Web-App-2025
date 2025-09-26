// app/auth/redirect/page.js
"use client"; // must be at the very top
export const dynamic = "force-dynamic";

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

export default function AuthRedirectPage() {
  return <AuthRedirectClient />;
}

// Client-only component
function AuthRedirectClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progressInterval;

    // Only run on client
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

      // Determine destination based on lastActiveRole
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
      }

      // Personalized toast
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

      // Redirect
      if (window.location.pathname !== destination) {
        setTimeout(() => router.replace(destination), 500);
      }

      setLoadingProgress(100);
      clearInterval(progressInterval);
    }

    handleRedirect();

    return () => clearInterval(progressInterval);
  }, [router, session, status]);

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
