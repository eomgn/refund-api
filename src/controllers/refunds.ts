import { Request, Response } from "express";

export class RefundsController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" });
  }
}
