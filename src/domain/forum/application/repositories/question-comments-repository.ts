import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { QuestionComment } from "../../enterprise/entities/question-comment.js";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;

  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
