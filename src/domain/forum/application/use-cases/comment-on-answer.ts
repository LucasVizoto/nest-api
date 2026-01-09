import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { AnswerRepository } from "../repositories/answers-repository.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}
type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      throw left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
