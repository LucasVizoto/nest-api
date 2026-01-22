import { right, type Either } from "@/core/either.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { Injectable } from "@nestjs/common";

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}
type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({
      answerComments,
    });
  }
}
