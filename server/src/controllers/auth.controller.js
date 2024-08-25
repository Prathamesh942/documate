import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "user registered successfully", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email" });
  }
  const user = await User.findOne({ $or: [{ email }] });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await user.comparePasswords(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const accessToken = await user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select(" -password");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json({ message: "User logged in", loggedInUser, accessToken });
};

const logoutUser = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json({ message: "User logged out" });
};

export { registerUser, loginUser, logoutUser };
