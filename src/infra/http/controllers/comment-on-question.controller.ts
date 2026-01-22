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
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

const commentOnQuestiontBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestiontBodySchema);

type CommentOnQuestiontBodySchema = z.infer<
  typeof commentOnQuestiontBodySchema
>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CommentOnQuestiontBodySchema,
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      questionId,
      authorId: userId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
