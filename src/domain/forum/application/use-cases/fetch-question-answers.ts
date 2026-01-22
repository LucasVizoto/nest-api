import { AnswerRepository } from "../repositories/answers-repository.js";
import { Answer } from "../../enterprise/entities/answer.js";
import { right, type Either } from "@/core/either.js";
import { Injectable } from "@nestjs/common";

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}
type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({
      answers,
    });
  }
}
