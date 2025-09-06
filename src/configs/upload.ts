import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

// a variável TPM_FOLDER é para guardar o arquivo temporariamente antes de movê-los para a pasta de uploads que é criada na variavel UPLOADS_FOLDER

//  ./../../tpm -> pastas: configs/src/raiz do projeto
const TPM_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); // o 'resolve' é para garantir que o código funcione em diferentes sistemas operacionais

const UPLOADS_FOLDER = path.resolve(TPM_FOLDER, "uploads");

// definindo tamanho máximo do arquivo: sendo definido entao em 3 megas
// 1KB = 1024
// 1MB = 1024 * 1024 (ou seja 1024 elevado a 2)
const MAX_FILE_SIZE = 1024 * 1024 * 3; //  3MB

// definindo tipos de arquivos aceitos
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// o 'diskStorage' do multer é o que permite que seja manipulado o arquivo no disco onde a api esta rodando
const MULTER = {
  storage: multer.diskStorage({
    // pasta temporaria
    destination: TPM_FOLDER,

    //  definindo nome do arquivo
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex"); // hash do arquivo
      const filename = `${fileHash}-${file.originalname}`; // criando nome para o arquivo e é importante para evitar que os arquivos se sobreponham

      return callback(null, filename);
    },
  }),
};

// o multer é middleware que sera utilizado em uma rota que ira receber algum arquivo
export default {
  TPM_FOLDER,
  UPLOADS_FOLDER,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  MULTER,
};
