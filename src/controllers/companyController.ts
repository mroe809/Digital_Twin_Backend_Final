import { Request, Response } from "express";
import DigitalTwinProcess from "../models/DTProcess";
import { BadRequestError } from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import Company from "../models/Company";


const addCompany = asyncHandler (async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const company = await Company.create({
      name,
      description
  });

  res.status(201).json("Erfolg!");
})

export { addCompany };