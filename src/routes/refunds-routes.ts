import { Router } from "express";
const refundsRoutes = Router();

// controllers
import { RefundsController } from "@/controllers/refunds-controller";
const refundsController = new RefundsController();

//middlewares
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

// routes
refundsRoutes.post(
  "/",
  verifyUserAuthorization(["employee"]),
  refundsController.create
);

refundsRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]),
  refundsController.index
);

refundsRoutes.get(
  "/:id",
  verifyUserAuthorization(["manager", "employee"]),
  refundsController.show
);

export { refundsRoutes };
