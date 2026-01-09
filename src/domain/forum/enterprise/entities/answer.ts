import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/core/types/optional.js";
import { AnswerAttachmentList } from "./answer-attachment-list.js";
import { AggregateRoot } from "@/core/entities/aggregate-root.js";
import { AnswerCreatedEvent } from "../events/answer-created-event.js";

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  attachments: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, "createdAt" | "attachments">,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  // ---------------- SETTERS ----------------

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachment: AnswerAttachmentList) {
    this.props.attachments = attachment;
    this.touch();
  }

  // ---------------- GETTERS ----------------

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
