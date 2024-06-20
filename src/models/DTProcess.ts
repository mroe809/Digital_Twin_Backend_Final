import mongoose, { Document, Schema } from "mongoose";
import { Interface } from "readline";

enum Status {
  Created,
  Started,
  StepTwo,
  StepThree,
  Completed
}

export interface IDigitalTwinProcess{
    processname: string;
    status: Status;
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    companyId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    materialId: string,
    postProcessingId: string,
    materialDescription: string,
    postProcessingDescription: string,
    comment: string,
    completedDate: Date
  }

const digitalTwinProcessSchema = new Schema<IDigitalTwinProcess>({
  processname: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required:true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
  status: { type: Number, required: true, default: Status.Created },
  materialId: { type: String },
  postProcessingId: { type: String },
  materialDescription: { type: String },
  postProcessingDescription: { type: String, },
  comment: { type: String },
  completedDate: { type: Date, default: null }
});

const DigitalTwinProcess = mongoose.model("DigitalTwinProcess", digitalTwinProcessSchema);

export default DigitalTwinProcess;