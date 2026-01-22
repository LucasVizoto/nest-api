import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";

import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param("answerId") answerId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      answerId,
      authorId: userId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
