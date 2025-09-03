import { Router } from "express";
const sessionsRoutes = Router();

// controllers
import { SessionsController } from "@/controllers/sessions-controller";
const sessionsController = new SessionsController();

// middlewares

// routes
sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };
