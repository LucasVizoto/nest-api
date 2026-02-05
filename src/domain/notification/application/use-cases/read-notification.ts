import { left, right, type Either } from "@/core/either.js";
import { NotificationsRepository } from "../repositories/notification-repository.js";
import { Notification } from "../../enterprise/entities/notification.js";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resourse-not-found-error.js";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error.js";
import { Injectable } from "@nestjs/common";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
