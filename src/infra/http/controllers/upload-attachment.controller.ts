import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
// import { QuestionPresenter } from "../presenters/question-presenter";
// import { UploadAttachmentsUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileValidationPipe } from "../pipes/upload-mime-validation-pipe";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";
import { InvalidAttachmentTypeError } from "@/domain/forum/application/use-cases/errors/invalid-attachment-type";

@Controller("/attachments")
export class UploadAttachmentsController {
  constructor(
    private uploadAndCreateAttachments: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(FileValidationPipe)
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachments.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;

    return {
      attachmentId: attachment.id.toString(),
    };
  }
}
