import express from "express";
import authRouter from "./routes/authRouter";
import connectUserDB from "./connections/userDB";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";
import userRouter from "./routes/userRouter";
import s3Router from "./routes/s3Router";
import processRouter from "./routes/processRouter";
import companyRouter from "./routes/companyRouter";
import helmet from "helmet";

dotenv.config();

interface UserBasicInfo {
  _id: string;
  email: string;
  accountType: string;
  companyId: string;
}

interface DigitalTwinProcess {
  _id: string;
  processname: string;
  companyId: string | null;
  materialId: string;
  postProcessingId: string;
  materialDescription: string;
  postProcessingDescription: string;
  comment: string;
  date: Date;
}

interface Company {
  _id: string;
  name: string;
  description: string;
}

declare global {
  namespace Express{
    interface Request{
      user?: UserBasicInfo | null;
      dTProcess?: DigitalTwinProcess | null;
      company?: Company | null;
    }
  }
}

const app = express();
const port = process.env.PORT || "";

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(authRouter);
app.use("/users", authenticate, userRouter);
app.use(authenticate, s3Router);
app.use(processRouter);


app.use(errorHandler);

connectUserDB();