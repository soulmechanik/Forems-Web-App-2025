// test.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Load MongoDB connection string
const MONGO_URI = process.env.MONGO_URI;

const propertyId = "68d1806226b719d416f435dd"; // 👈 replace with property id you want to test

// Define schemas minimally for testing
const propertySchema = new mongoose.Schema({}, { strict: false });
const landlordSchema = new mongoose.Schema({}, { strict: false });
const userSchema = new mongoose.Schema({}, { strict: false });

const Property = mongoose.model("Property", propertySchema, "properties");
const Landlord = mongoose.model("Landlord", landlordSchema, "landlords");
const User = mongoose.model("User", userSchema, "users");

async function runTest() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      console.log("❌ Property not found");
      return;
    }
    console.log("🏠 Property found:", property.propertyName);

    // 2. Find landlord using property.landlord
    const landlord = await Landlord.findById(property.landlord);
    if (!landlord) {
      console.log("⚠️ No landlord found for ID:", property.landlord);
      return;
    }
    console.log("👤 Landlord document found. ID:", landlord._id.toString());

    // 3. Find user linked to landlord
    const user = await User.findById(landlord.userId).select("name email");
    if (!user) {
      console.log("⚠️ No user found for landlord.userId:", landlord.userId);
      return;
    }

    console.log("✅ Landlord’s User Info:");
    console.log("   Name :", user.name);
    console.log("   Email:", user.email);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
