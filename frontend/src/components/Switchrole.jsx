"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ALL_ROLES = ["landlord", "tenant", "agent", "propertyManager"];

export default function SwitchRoleWidget({ className = "" }) {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Get current role from session
  const currentRole = session?.user?.lastActiveRole || ALL_ROLES[0];

  const roleConfigMap = {
    landlord: { emoji: "🏠", label: "Landlord" },
    tenant: { emoji: "🛋️", label: "Tenant" },
    agent: { emoji: "🕵️‍♂️", label: "Agent" },
    propertyManager: { emoji: "📋", label: "Property Manager" },
  };

  // Handle popup animation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Show toast after redirect if roleSwitched exists
  useEffect(() => {
    const role = sessionStorage.getItem("roleSwitched");
    if (role) {
      const config = roleConfigMap[role] || {};
      toast.custom(
        (t) => (
          <div
            className={`px-5 py-3 rounded-xl bg-white/90 backdrop-blur-sm text-gray-800 font-medium flex items-center space-x-3 border border-white/20 shadow-lg transform transition-all duration-500 ${
              t.visible ? "animate-toast-in" : "animate-toast-out"
            }`}
          >
            <span className="text-xl">{config.emoji || "🎉"}</span>
            <span>{`You're now viewing as a ${config.label || role}!`}</span>
          </div>
        ),
        { id: "role-switched", duration: 3000 }
      );
      sessionStorage.removeItem("roleSwitched");
    }
  }, []);

  const handleSwitch = async (role) => {
    if (role === currentRole) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/switch-role`,
        { role },
        { withCredentials: true }
      );

      if (res.data.user) {
        await update({
          ...session,
          user: {
            ...session.user,
            lastActiveRole: res.data.user.lastActiveRole,
          },
        });
      }

      sessionStorage.setItem("roleSwitched", role);
      window.location.href = `/auth/redirect`;
    } catch (err) {
      console.error(
        "[SwitchRoleWidget] Role switch failed:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Failed to switch role", {
        id: "switch-role",
      });
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: { background: "transparent", boxShadow: "none" },
        }}
      />

      {/* Trigger Button */}
    <button
  onClick={() => setIsOpen(true)}
  className={`px-1 py-1   font-semibold text-sm ${className}`}
>
  Switch Role
</button>


      {/* Popup Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden transform transition-all duration-500 ${
              isVisible ? "animate-popup-in" : "animate-popup-out"
            } w-full max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800 cursor-pointer">Switch Role</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Forems Best Feature text */}
              <p className="text-xs text-gray-500 mb-3 font-medium">Forems Best Feature</p>

              {/* Current Role */}
              <div className="mb-4 p-3 bg-white/50 rounded-lg border border-white/30">
                <p className="text-xs text-gray-500 mb-1">Current View</p>
                <div className="flex items-center">
                  <span className="text-xl mr-2">{roleConfigMap[currentRole]?.emoji}</span>
                  <span className="font-medium text-gray-800 text-sm">{roleConfigMap[currentRole]?.label}</span>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <p className="text-xs text-gray-600 mb-2">Select a different role to switch to:</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_ROLES.filter((r) => r !== currentRole).map((role) => {
                    const config = roleConfigMap[role];
                    return (
                      <button
                        key={role}
                        onClick={() => handleSwitch(role)}
                        disabled={loading}
                        className="flex items-center p-2.5 rounded-xl bg-white/50 border border-white/30 hover:bg-white/80 transition-all duration-300 hover:shadow-sm cursor-pointer"
                      >
                        <span className="text-xl mr-2">{config.emoji}</span>
                        <span className="text-left flex-1 font-medium text-gray-800 text-sm">{config.label}</span>
                        {loading && (
                          <svg
                            className="animate-spin h-3 w-3 text-purple-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes popup-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popup-out {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes toast-in {
          0% { opacity: 0; transform: translateY(-15px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-out {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-15px) scale(0.95); }
        }
        .animate-popup-in {
          animation: popup-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-popup-out {
          animation: popup-out 0.3s ease-in forwards;
        }
        .animate-toast-in {
          animation: toast-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-toast-out {
          animation: toast-out 0.3s ease-in forwards;
        }
      `}</style>
    </>
  );
}
