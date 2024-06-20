import express from "express";
import { addCompany } from "../controllers/companyController";
import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";



const router = express.Router();
router.post("/createCompany", addCompany);


export default router;