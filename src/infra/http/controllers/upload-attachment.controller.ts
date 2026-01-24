import {
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

@Controller("/attachments")
export class UploadAttachmentsController {
  //  constructor(private uploadAttachments: UploadAttachmentsUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(FileValidationPipe)
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
