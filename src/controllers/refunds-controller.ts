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
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    // recuperando 'query' passada na requisicao
    const { name, page, perPage } = querySchema.parse(request.query);

    // calculando os valores de 'skip' para paginacao
    const skip = (page - 1) * perPage;

    // recuperando array de 'refund' mas se houver parametro realizar filtro com 'where' e 'like'(contains) alem de incluir o 'user' que criou o 'refund' e ordenar
    const refunds = await prisma.refund.findMany({
      skip,
      take: perPage,
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

    // obtendo o total de registros para cálcular o número de páginas com 'count' do prisma
    const totalRecords = await prisma.refund.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    // obtendo o total de paginas
    const totalPages = Math.ceil(totalRecords / perPage);

    response.status(201).json({
      refunds,
      page,
      perPage,
      totalRecords,
      totalPages,
    });
  }

  // ### SHOW ###
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    // obtendo registro pelo 'id' passado no parametro da rota
    const refund = await prisma.refund.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    response.json(refund);
  }
}
