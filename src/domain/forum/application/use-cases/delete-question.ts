import { left, right, type Either } from "@/core/either.js";
import { QuestionRepository } from "../repositories/questions-repository.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { Injectable } from "@nestjs/common";

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}
type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionRepository.delete(question);

    return right(null);
  }
}
