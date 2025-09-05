import { Router } from "express";
const refundsRoutes = Router();

// controllers
import { RefundsController } from "@/controllers/refunds";
const refundsController = new RefundsController();

//middlewares
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

// routes
refundsRoutes.post(
  "/",
  verifyUserAuthorization(["employee"]),
  refundsController.create
);

export { refundsRoutes };
