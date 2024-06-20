import express from "express";
import { getUser, getUsers } from "../controllers/userController";
import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";

const router = express.Router();

router.get(
    "/:id",
    authorize([Roles.Manufacturer, Roles.Customer, Roles.Admin]),
    getUser
  );
  
  router.get("/", authorize([Roles.Manufacturer]), getUsers);
  
  export default router;