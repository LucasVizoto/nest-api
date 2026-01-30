import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { Question } from "../../enterprise/entities/question.js";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details.js";

export abstract class QuestionRepository {
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract save(question: Question): Promise<void>;
  abstract create(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
}
