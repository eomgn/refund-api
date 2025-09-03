import { Request, Response } from "express";
import { z } from "zod";

export class SessionsController {
  async create(request: Request, response: Response) {
    return response.json({ message: "Rota ok" });
  }
}
