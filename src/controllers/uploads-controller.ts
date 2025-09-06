import { Request, Response } from "express";
import { z } from "zod";
import uploadConfig from "@/configs/upload";

export class UploadsController {
  async create(request: Request, response: Response) {
    // criando schema para garantir que o arquivo enviado atenda os requisitos - o 'passthrough' é para o zod nao reclamar que nao esta sendo passado todos os parametros do z.object
    const fileSchema = z
      .object({
        filename: z.string().min(1, { message: "Arquivo é obrigatório." }),
        mimetype: z
          .string()
          .refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), {
            message: `Formato de arquivo inválido. Formatos permitidos ${uploadConfig.ACCEPTED_IMAGE_TYPES}`,
          }),
        size: z
          .number()
          .positive()
          .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
            message: `O arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE}MB`,
          }),
      })
      .passthrough();

    const { file } = fileSchema.parse(request.file);

    response.json({ message: "ok" });
  }
}
