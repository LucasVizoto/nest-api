import {
  Injectable,
  PipeTransform,
  ParseFilePipe,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { CustomUploadTypeValidator } from "./validators/custom-file-type.validator";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  // Instanciamos o pipe nativo aqui dentro com as configurações desejadas
  private readonly validationPipe = new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024 * 2, // 2MB
      }),
      new CustomUploadTypeValidator({
        fileType: ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
      }),
    ],
  });

  async transform(value: Express.Multer.File) {
    return this.validationPipe.transform(value);
  }
}
