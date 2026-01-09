import { makeAnswer } from "test/factories/make-answer.js";
import { OnAnswerCreated } from "./on-answer-created.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";
import {
  describe,
  it,
  beforeEach,
  expect,
  vi,
  type MockInstance,
} from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { SendNotificationUseCase } from "../use-cases/send-notification.js";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import { waitFor } from "test/utils/wait-fot.js";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance;

describe("On Answer Created", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute"); // quando eu chamar,

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it("should send a notification when an answer is created", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    inMemoryQuestionsRepository.create(question);
    inMemoryAnswersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
