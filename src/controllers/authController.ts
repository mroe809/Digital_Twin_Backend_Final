import { Request, Response } from "express";
import User from "../models/User";
import { generateToken, clearToken } from "../utils/auth";
import {
  BadRequestError,
  AuthenticationError,
} from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import { ObjectId } from 'mongoose';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, accountType, companyId } = req.body;
  const userExists = await User.findOne({ email });
 
  if (userExists) {
    res.status(400).json({ message: "The user already exists" });
  }
  
  const user = await User.create({
    name,
    email,
    password,
    accountType,
    companyId,
  });

  if (user) {
    generateToken(res, {
      userId: user._id,
      userEmail: user.email,
      accountType: user.accountType,
      companyId: (user.companyId as ObjectId).toString(),
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
    });

} else {
  throw new BadRequestError("An error occurred in registering the user");
}
});

const authenticateUser = asyncHandler(async (req: Request, res: Response) => {  
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  

  if (user && (await user.comparePassword(password))) {
    
    generateToken(res, {
      userId: user._id,
      userEmail: user.email,
      accountType: user.accountType,
      companyId: user.companyId?.toString() || null,
    });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      companyId: user.companyId?.toString() || null
    });
  } else {
    throw new AuthenticationError("User not found / password incorrect");  
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {  
  clearToken(res);
  res.status(200).json({ message: "Successfully logged out" });
});

export { registerUser, authenticateUser, logoutUser };