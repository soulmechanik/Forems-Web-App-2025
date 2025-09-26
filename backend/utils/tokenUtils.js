// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  if (!userId) throw new Error("User ID is required for token generation");
  return jwt.sign(
    { id: userId },           // ✅ only store the MongoDB _id
    process.env.JWT_SECRET,
    { expiresIn: "7d" }       // token valid for 7 days
  );
};
