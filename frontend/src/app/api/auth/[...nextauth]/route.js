import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: process.env.NODE_ENV === "development" ? 10 * 60 : 2 * 60 * 60, // 10min dev, 2h prod
  },

  callbacks: {
    // 1️⃣ signIn callback
    async signIn({ user, account }) {
      console.log("🛬 [Auth] User signing in via provider:", account.provider);

      if (account.provider === "google") {
        try {
          const controller = new AbortController(); // 🔥 ADD TIMEOUT
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/googleAuth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              googleId: user.id,
            }),
            signal: controller.signal, // 🔥 ADD ABORT SIGNAL
          });

          clearTimeout(timeoutId); // 🔥 CLEAR TIMEOUT

          const data = await res.json();

          if (!res.ok || data.error) {
            console.error("💥 [Auth] Backend rejected user:", data.error);
            return `/login?error=${encodeURIComponent(data.error || "auth_failed")}`;
          }

          console.log("✅ [Auth] Backend authentication successful!");

          // Attach backend data
          user._id = data.user._id;
          user.roles = data.user.roles ?? [];
          user.lastActiveRole = data.user.lastActiveRole ?? null;
          user.onboarded = data.user.onboarded ?? false;
          user.verified = data.user.verified ?? false;
          user.backendToken = data.token;

          console.log("🪙 [Auth] User enriched for JWT:", {
            _id: user._id,
            roles: user.roles,
            lastActiveRole: user.lastActiveRole,
          });

        } catch (err) {
          console.error("💥 [Auth] Backend error during signIn:", err.message);
          
          // 🔥 BETTER ERROR HANDLING
          if (err.name === 'AbortError') {
            return `/login?error=${encodeURIComponent('Connection timeout. Please try again.')}`;
          }
          
          return `/login?error=${encodeURIComponent(err.message)}`;
        }
      }

      return true;
    },

    // 2️⃣ jwt callback
    async jwt({ token, user, trigger, session }) {
      // First-time login
      if (user) {
        token.id = user._id;
        token.roles = user.roles ?? [];
        token.lastActiveRole = user.lastActiveRole ?? null;
        token.backendToken = user.backendToken ?? null;
        console.log("✨ [JWT] First-time login detected:", token);
      }

      // Update trigger - fetch fresh data from backend
      if (trigger === "update") {
        console.log("🔄 [JWT] Update trigger detected. Fetching fresh data from backend...");
        
        try {
          const controller = new AbortController(); // 🔥 ADD TIMEOUT
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for updates

          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
            method: "GET",
            headers: { 
              "Authorization": `Bearer ${token.backendToken}`,
              "Content-Type": "application/json"
            },
            signal: controller.signal, // 🔥 ADD ABORT SIGNAL
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const freshUserData = await res.json();
            console.log("✅ [JWT] Fresh user data fetched:", freshUserData);
            
            // Update token with fresh data
            token.roles = freshUserData.user?.roles ?? token.roles;
            token.lastActiveRole = freshUserData.user?.lastActiveRole ?? token.lastActiveRole;
            token.onboarded = freshUserData.user?.onboarded ?? token.onboarded;
            token.verified = freshUserData.user?.verified ?? token.verified;
            
            console.log("🔄 [JWT] Token updated with fresh data:", {
              lastActiveRole: token.lastActiveRole,
              roles: token.roles
            });
          } else {
            console.error("💥 [JWT] Failed to fetch fresh user data:", res.status);
            
            // 🔥 TOKEN VALIDATION - If backend rejects token, force re-login
            if (res.status === 401 || res.status === 403) {
              console.error("🚨 [JWT] Invalid token detected, forcing logout...");
              return {}; // This will invalidate the session
            }
          }
        } catch (error) {
          console.error("💥 [JWT] Error fetching fresh user data:", error);
          
          // 🔥 DON'T BREAK SESSION ON NETWORK ERRORS - just log and continue
          if (error.name !== 'AbortError') {
            console.error("🔄 [JWT] Using cached token data due to network error");
          }
        }

        // Also check if session data was passed explicitly
        if (session?.user?.lastActiveRole) {
          token.lastActiveRole = session.user.lastActiveRole;
          console.log("🔄 [JWT] Also updated from session data:", session.user.lastActiveRole);
        }
      }

      return token;
    },

    // 3️⃣ session callback
    async session({ session, token }) {
      // 🔥 VALIDATE TOKEN BEFORE CREATING SESSION
      if (!token.id) {
        return null; // Invalid session
      }

      session.user = {
        _id: token.id,
        roles: token.roles ?? [],
        lastActiveRole: token.lastActiveRole ?? null,
        onboarded: token.onboarded ?? false,
        verified: token.verified ?? false,
        // backendToken is NOT exposed for security
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // 🔥 REDIRECT ERRORS TO LOGIN PAGE
  },

  
  // 🔥 PRODUCTION EVENTS FOR MONITORING
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`✅ [Auth Event] User signed in: ${user.email} via ${account.provider}`);
      // Add your analytics/monitoring here
    },
    async signOut({ token }) {
      console.log(`👋 [Auth Event] User signed out: ${token.email}`);
      // Add your analytics/monitoring here
    },
    async session({ session, token }) {
      // Only log in development to avoid spam
      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 [Auth Event] Session accessed: ${session.user._id}`);
      }
    }
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };