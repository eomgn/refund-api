import { Router } from "express";
const refundsRoutes = Router();

// controllers
import { RefundsController } from "@/controllers/refunds";
const refundsController = new RefundsController();

//middlewares

// routes
refundsRoutes.post("/", refundsController.create);

export { refundsRoutes };
