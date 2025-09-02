import express from "express";
import cors from "cors";

// errorHandling
import { errorHandling } from "@/middleware/error-handling";
import "express-async-errors";

import { routes } from "@/routes/index";

const app = express();
app.use(express.json());
app.use(cors());

// rotas
app.use(routes);

// aplicando errorHandling
app.use(errorHandling);

export { app };
