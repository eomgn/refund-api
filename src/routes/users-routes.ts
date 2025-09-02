import { Router } from "express";
const usersRoutes = Router();

// controllers
import { UsersController } from "@/controllers/users-controller";
const usersController = new UsersController();

// middlewares

// routes
usersRoutes.use("/", usersController.create);

export { usersRoutes };
