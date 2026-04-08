import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

const buildAuthResponse = (userId, email) => ({
  token: signToken({ userId, email }),
  user: {
    id: userId,
    email
  }
});

export const registerUser = async (email, password) => {
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    email,
    password: hashedPassword
  });

  return buildAuthResponse(user._id.toString(), user.email);
};

export const loginUser = async (email, password) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return buildAuthResponse(user._id.toString(), user.email);
};
