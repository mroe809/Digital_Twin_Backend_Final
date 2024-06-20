import { Request, Response } from "express";
import DigitalTwinProcess from "../models/DTProcess";
import { BadRequestError } from "../middleware/errorMiddleware";
import asyncHandler from "express-async-handler";
import mongoose, { Document, Schema } from "mongoose";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { uploadFile } from "../connections/s3UploadController"
import Company from "../models/Company";

const getProcessById = asyncHandler(async (req: Request, res: Response) => {
    const processId = req.params.processId;
    const dTProcess = await DigitalTwinProcess.findById(processId, "processname companyId customerId comment status");

    if (!dTProcess) {
        throw new BadRequestError("Process not found");
    }

    res.status(200).json(dTProcess);
})

const getProcessesForCustomer = asyncHandler(async (req: Request, res: Response) => {
  const customerId = req.user?._id;
  const dTProcesses = await DigitalTwinProcess.find({ customerId: customerId }, "processname companyId customerId _id" );

  res.status(201).json(dTProcesses);
})

const getProcessesForCompanyId = asyncHandler(async (req: Request, res: Response) => {
  const companyId = req.user?.companyId;
  const dTProcesses = await DigitalTwinProcess.find({ companyId: companyId }, "processname companyId customerId _id" );

  res.status(201).json(dTProcesses);
})

const getAllProcesses = asyncHandler(async (req: Request, res: Response) => {
    const dTProcesses = await DigitalTwinProcess.find({}, "name userId");

    res.status(200).json(
        dTProcesses.map((dTProcess) => {
          return { id: dTProcess._id, processname: dTProcess.processname, email: dTProcess.customerId };
        })
      );
})

const getAllCompanies = asyncHandler(async (req: Request, res: Response) => {
  const companies = await Company.find({}, "_id name");

  res.status(200).json(
    companies.map((company) => {
        return { id: company._id, name: company.name };
      })
    );
})

const addProcess = asyncHandler (async (req: Request, res: Response) => {
  const { 
    processname, 
    companyId, 
    materialId, 
    postProcessingId, 
    materialDescription, 
    postProcessingDescription, 
    comment 
  } = req.body;
  const customerId = req.user?._id; //|| "661598ee2bbe6a3dc9abd48e";

  const dTProcess = await DigitalTwinProcess.create({
    processname,
    companyId, 
    customerId,
    materialId, 
    postProcessingId,
    materialDescription, 
    postProcessingDescription,
    comment
  });

  res.status(201).json(dTProcess);
})

const updateProcess = asyncHandler (async (req: Request, res: Response) => {
  const { name, userId, manufacturerId } = req.body;



  res.status(501).json("Not implemented");
})

const setNextProcessStatus = asyncHandler (async (req: Request, res: Response) => {
  const processId = req.params.processId;
  const existingDTProcess = await DigitalTwinProcess.findById(processId);
  if (existingDTProcess) {
    const currentStatus = existingDTProcess.status;
    const statuses = Object.values(Status);
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    const updatedDTProcess = await DigitalTwinProcess.findByIdAndUpdate(processId, {
      status: statuses[nextIndex]
    }, { new: true });

    res.status(201).json(updatedDTProcess);
  }

  res.status(500).json("No Process found");
})
enum Status {
  Created,
  Started,
  StepTwo,
  StepThree,
  Completed
}
const setPreviousProcessStatus = asyncHandler (async (req: Request, res: Response) => {
  const processId = req.params.processId;
  const existingDTProcess = await DigitalTwinProcess.findById(processId);
  if (existingDTProcess) {
    const currentStatus = existingDTProcess.status;
    const statuses = Object.values(Status);
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex -1) % statuses.length;
    
    const updatedDTProcess = await DigitalTwinProcess.findByIdAndUpdate(processId, {
      status: statuses[nextIndex]
    }, { new: true });
  
    res.status(201).json(updatedDTProcess);
  }

  res.status(500).json("No Process found");
})

export { getProcessById, getProcessesForCustomer, getProcessesForCompanyId, getAllProcesses, addProcess, setNextProcessStatus, setPreviousProcessStatus, getAllCompanies };