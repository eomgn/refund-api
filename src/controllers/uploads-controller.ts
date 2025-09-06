import { Request, Response } from "express";

export class UploadsController {
  async create(request: Request, response: Response) {
    response.json(request.file);
  }
}
