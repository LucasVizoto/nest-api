import type { AnswerRepository } from "../repositories/answers-repository.js";
import type { Answer } from "../../enterprise/entities/answer.js";
import { right, type Either } from "@/core/either.js";

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
