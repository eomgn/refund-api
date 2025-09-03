import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";

export class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "E-mail inválido." }),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    // recuperando usuario pelo email
    const user = await prisma.user.findFirst({ where: { email } });

    // verificando se o user existe com o email passado
    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    // comparando a senha do user e verificando se dar matched com cadastrada
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    return response.json({ email, password });
  }
}
