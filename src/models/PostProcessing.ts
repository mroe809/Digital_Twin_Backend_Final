import mongoose, { Document, Schema } from "mongoose";
import { Interface } from "readline";

export interface IPostProcessing
{
    name: string,
    dTProcesses: mongoose.Schema.Types.ObjectId[]
};

const materialSchema = new Schema<IPostProcessing>({
  name: { type: String, required: true },
  dTProcesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalTwinProcess' }],
});

const PostProcessing = mongoose.model("PostProcessing", materialSchema);

export default PostProcessing;