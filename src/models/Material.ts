import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial
{
    name: string,
    dTProcesses: mongoose.Schema.Types.ObjectId[]
};

const materialSchema = new Schema<IMaterial>({
  name: { type: String, required: true },
  dTProcesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigitalTwinProcess' }],
});

const Material = mongoose.model("Material", materialSchema);

export default Material;