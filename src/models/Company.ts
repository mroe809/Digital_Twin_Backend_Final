import mongoose, { Document, Schema } from "mongoose";

export interface ICompany{
    name: string;
    description: string;
  }

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    description: { type: String, required: true },
  });
  
  const Company = mongoose.model("Company", CompanySchema);
  
  export default Company;