import { Router } from "express";
const routes = Router();

// arquivos de rotas
import { usersRoutes } from "@/routes/users-routes";

// rotas publicas
routes.use("/users", usersRoutes);

export { routes };
