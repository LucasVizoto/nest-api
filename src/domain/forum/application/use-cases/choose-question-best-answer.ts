import type { AnswerRepository } from "../repositories/answers-repository.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { QuestionRepository } from "../repositories/questions-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw left(new ResourceNotFoundError());
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionRepository.save(question);

    return right({
      question,
    });
  }
}
