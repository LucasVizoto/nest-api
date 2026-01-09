import { Entity } from "@/core/entities/entities.js";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/core/types/optional.js";

export interface NotificationProps {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  // ----------- GETTERS -----------//
  get recipentId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }

  read() {
    this.props.readAt = new Date();
  }
}
