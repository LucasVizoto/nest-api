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
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";

const answerQuestiontBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestiontBodySchema);

type AnswerQuestiontBodySchema = z.infer<typeof answerQuestiontBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AnswerQuestiontBodySchema,
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      questionId,
      authorId: userId,
      content,
      attachmentIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
