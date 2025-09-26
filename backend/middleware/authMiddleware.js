// middleware/authMiddleware.js
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";
import User from "../models/User.js";

/**
 * Protect middleware
 * - Checks NextAuth session cookie
 * - Fallbacks to Bearer JWT
 * - Attaches user document to req.user
 * - Logs info in dev mode only
 */
const protect = asyncHandler(async (req, res, next) => {
  try {
    let user = null;

    // 1️⃣ Try NextAuth session cookie
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req, secret });

    if (token?.id) {
      // MongoDB _id stored in NextAuth token
      user = await User.findById(token.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found (NextAuth)");
      }
      req.user = user;

      if (process.env.NODE_ENV !== "production") {
        console.log("[PROTECT] NextAuth user:", user._id, user.email);
      }
      return next();
    }

    // 2️⃣ Fallback: Bearer token
    if (req.headers.authorization?.startsWith("Bearer")) {
      const jwtToken = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found (JWT)");
      }
      req.user = user;

      if (process.env.NODE_ENV !== "production") {
        console.log("[PROTECT] JWT user:", user._id, user.email);
      }
      return next();
    }

    // 3️⃣ No token
    res.status(401);
    throw new Error("Not authorized, no valid session or token");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[PROTECT] Auth failed:", error.message);
    }
    res.status(401).json({ message: "Not authorized" });
  }
});

export { protect };
