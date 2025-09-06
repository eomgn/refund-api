import { Router } from "express";
const uploadsRoutes = Router();

// configs
import uploadConfig from "@/configs/upload";

// controllers
import { UploadsController } from "@/controllers/uploads-controller";
const uploadsController = new UploadsController();

// middlewares
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

import multer from "multer";
const upload = multer(uploadConfig.MULTER);

// routes
uploadsRoutes.use(verifyUserAuthorization(["employee"])); // aplicando o middleware para todas as rotas
uploadsRoutes.post("/", upload.single("file"), uploadsController.create); // utilizando o middleware 'upload' criado com middleware 'multer'

export { uploadsRoutes };
