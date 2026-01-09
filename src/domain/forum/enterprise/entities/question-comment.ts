import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/core/types/optional.js";
import { Comment, type CommentProps } from "./comments.js";

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return questionComment;
  }
}
