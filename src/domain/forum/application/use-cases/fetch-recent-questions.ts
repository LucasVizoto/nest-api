import { right, type Either } from "@/core/either.js";
import { Question } from "../../enterprise/entities/question.js";
import { QuestionRepository } from "../repositories/questions-repository.js";
import { Injectable } from "@nestjs/common";

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}
type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
