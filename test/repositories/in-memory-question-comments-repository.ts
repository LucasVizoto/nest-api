import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository.js";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment.js";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];
  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(
            "Author with ID " + comment.authorId.toString() + " not found.",
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
        });
      });

    return questionComments;
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(question: QuestionComment) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);
  }
}
