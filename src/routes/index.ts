import { Router } from "express";
const routes = Router();

// arquivos de rotas
import { usersRoutes } from "@/routes/users-routes";
import { sessionsRoutes } from "@/routes/sessions-routes";

// rotas publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

export { routes };
