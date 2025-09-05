import { Request, Response } from "express";
import { z } from "zod";
import { Category } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

export class RefundsController {
  // ### CREATE ###
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .trim()
        .min(3, { message: "O nome de ver ter pelo menos 3 caracteres." }),
      amount: z
        .number()
        .positive({ message: "Não pode ser  um número menor que 1." }),
      category: z.enum([
        Category.accommodation,
        Category.food,
        Category.others,
        Category.services,
        Category.transport,
      ]),
      filename: z.string().min(20),
    });

    const { name, amount, category, filename } = bodySchema.parse(request.body);

    // verificando se existe um usuário autenticado
    if (!request.user.user_id) {
      throw new AppError("Unauthorized", 401);
    }

    // criando refund no banco de dados
    const refund = await prisma.refund.create({
      data: {
        name,
        amount,
        category,
        filename,
        userId: request.user.user_id,
      },
    });

    return response.status(201).json(refund);
  }

  // ### INDEX ###

  async index(request: Request, response: Response) {
    // schema para o que sera passado na requisicao
    const querySchema = z.object({
      name: z.string().optional().default(""),
    });

    // recuperando 'query' passada na requisicao
    const { name } = querySchema.parse(request.query);

    // recuperando array de 'refund' mas se houver parametro realizar filtro com 'where' e 'like'(contains) alem de incluir o 'user' que criou o 'refund' e ordenar
    const refunds = await prisma.refund.findMany({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    response.status(201).json(refunds);
  }
}
