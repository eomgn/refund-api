import express from "express";
import cors from "cors";

// errorHandling
import { errorHandling } from "@/middleware/error-handling";
import "express-async-errors";

const app = express();
app.use(express.json());
app.use(cors());

// aplicando errorHandling
app.use(errorHandling);

export { app };
