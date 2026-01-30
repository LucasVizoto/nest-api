import { QuestionRepository } from "../repositories/questions-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details.js";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}
type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionRepository.findDetailsBySlug(slug);

    if (!question) {
      throw left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
