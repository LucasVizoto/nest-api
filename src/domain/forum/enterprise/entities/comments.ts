import { Entity } from "@/core/entities/entities.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

export interface CommentProps {
  authorId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  // ---------------- SETTERS ----------------

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  // ---------------- GETTERS ----------------

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
