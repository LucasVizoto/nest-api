import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author.js";

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;

  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
