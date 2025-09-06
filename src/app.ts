import express from "express";
import cors from "cors";

// errorHandling
import { errorHandling } from "@/middleware/error-handling";
import "express-async-errors";

import { routes } from "@/routes/index";
import uploadConfig from "./configs/upload";

const app = express();
app.use(express.json());
app.use(cors());

// aplicando rota de para exibir arquivos de uploads
app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER));

// rotas
app.use(routes);

// aplicando errorHandling
app.use(errorHandling);

export { app };
