import { expect, describe, beforeEach, it } from "vitest";
import { SendNotificationUseCase } from "./send-notification.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository.js";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to create a notification", async () => {
    const result = await sut.execute({
      recipientId: "1",
      title: "Nova Notificação",
      content: "Conteúdo da notificação",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    );
  });
});
