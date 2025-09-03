import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";

import { hash } from "bcrypt";

export class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(3, "O nome precisa ter pelo menos 3 caracteres."),
      email: z
        .string()
        .trim()
        .email({ message: "E-mail inválido." })
        .toLowerCase(),
      password: z
        .string()
        .trim()
        .min(6, "A senha  precisa ter pelo menos 6 caracteres.")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "A senha precisa conter pelo menos um caractere especial."
        )
        .regex(
          /[A-Z]/,
          "A senha precisa conter pelo menos uma letra maiúscula."
        )
        .regex(/[0-9]/, "A senha precisa conter pelo menos um número."),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.manager),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    // verificando se já existe um usário cadastrado com o email passado
    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError("Já existe um usuário cadastrado com esse e-mail.");
    }

    // criando um hashed para a senha com bcrypt
    const hashedPassword = await hash(password, 8);

    // cadastrando usuário no banco de dados
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return response.status(201).json();
  }
}
