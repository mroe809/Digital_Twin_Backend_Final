import express from "express";
import { 
    getProcessById, 
    getAllProcesses, 
    getProcessesForCompanyId, 
    getProcessesForCustomer, 
    addProcess,
    setNextProcessStatus,
    setPreviousProcessStatus,
    getAllCompanies
} from "../controllers/processController";
import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";

const router = express.Router();

router.get("/getProcessesForCompanyId", getProcessesForCompanyId);
router.get("/getProcessesForCustomer", getProcessesForCustomer);
router.get("/getAllProcesses", authorize([Roles.Admin]), getAllProcesses);
router.get("/getProcessById/:processId", getProcessById);
router.get("/getAllCompanies/", getAllCompanies);
router.get("/setNextProcessStatus/:processId", setNextProcessStatus);
router.get("/setPreviousProcessStatus/:processId", setPreviousProcessStatus);
// router.get("/:id", getProcess);

router.post("/createProcess", addProcess)

export default router;