import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization failed: No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    req.userId = decoded.id;
    req.role = decoded.role;
    console.log(`User role: ${decoded.role} | Token verified successfully`);

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Authorization failed: Token expired." });
    }

    return res
      .status(401)
      .json({ success: false, message: "Authorization failed: Invalid token." });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authorization failed: User ID missing.",
      });
    }

    const user = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    const account = user || doctor;

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Authorization failed: Account not found.",
      });
    }

    if (!roles.includes(account.role)) {
      return res.status(403).json({
        success: false,
        message: "Authorization failed: Access denied.",
      });
    }

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during authorization.",
    });
  }
};
