import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { z } from "zod";

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

    // criando token de autenticacao
    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    // retornando user sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}
