import express from "express";
import {uploadFile} from "../connections/s3UploadController";
import {getFiles, downloadFile} from "../connections/s3DownloadController";

import { authorize } from "../middleware/authMiddleware";
import { Roles } from "../constants";
import { createFolders } from "../controllers/s3folderController";


const router = express.Router();

router.post("/upload", authorize([Roles.Manufacturer,Roles.Customer]), uploadFile);
router.post("/files", getFiles);
router.post("/download/", downloadFile);
router.post("/folders", createFolders)

export default router;