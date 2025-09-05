import { Router } from "express";
const routes = Router();

// middlewares
import { ensureAutheticated } from "@/middleware/ensure-authenticated";

// arquivos de rotas
import { usersRoutes } from "@/routes/users-routes";
import { refundsRoutes } from "./refunds-routes";
import { sessionsRoutes } from "@/routes/sessions-routes";

// rotas publicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

// rotas privadas
// ----> aplicando middleware a todas as rotas privadas abaixo <----
routes.use(ensureAutheticated);

routes.use("/refunds", refundsRoutes);

export { routes };
