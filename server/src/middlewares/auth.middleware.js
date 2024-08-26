import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(" -password");
    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ message: "Invalid access token" });
  }
};
