import mongoose from "mongoose";

const connectDigitalTwinProcessDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || ""); 
        console.log('MongoDB Connected: ${conn.connection.host}');
    } catch (error: any) {
        console.error('Error: ${error.message}');
        process.exit(1);
    }
}
  
export default connectDigitalTwinProcessDB;