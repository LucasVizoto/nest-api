import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { QuestionRepository } from "../repositories/questions-repository.js";
import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}
type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw left(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
