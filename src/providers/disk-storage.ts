import fs from "node:fs";
import path from "node:path";
import uploadConfig from "@/configs/upload";

export class DiskStorage {
  // ### SALVAR ###
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.TPM_FOLDER, file); // pasta temporaria (tmp)
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); // pasta de destino (dest/uploads)

    // bloco de trycatch que garante que o arquivo existe antes de realizar manipulacao
    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      console.log(error);
      throw new Error(`Arquivo não encontrado: ${tmpPath}`);
    }

    // garantindo que existe a pagina de uploads
    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true });

    // mudando o arquivo de lugar
    await fs.promises.rename(tmpPath, destPath);

    return file;
  }

  // ### DELETAR ###
  async deleteFile(file: string, type: "tmp" | "uploads") {
    const pathFile =
      type === "tmp" ? uploadConfig.TPM_FOLDER : uploadConfig.UPLOADS_FOLDER;

    const filePath = path.resolve(pathFile, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
