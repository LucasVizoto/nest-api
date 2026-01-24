import { FileValidator } from "@nestjs/common";

export interface CustomUploadTypeValidatorOptions {
  fileType: string[];
}

export class CustomUploadTypeValidator extends FileValidator<CustomUploadTypeValidatorOptions> {
  buildErrorMessage(): string {
    return `Upload not allowed. Expected: ${this.validationOptions.fileType.join(", ")}`;
  }

  isValid(file: any): boolean {
    if (!this.validationOptions) {
      return true;
    }
    // Verifica se o mimetype do arquivo está dentro do array permitido
    return this.validationOptions.fileType.includes(file.mimetype);
  }
}
