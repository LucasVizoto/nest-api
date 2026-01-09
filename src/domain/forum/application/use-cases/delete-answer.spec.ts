import { expect, describe, beforeEach, it } from "vitest";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { DeleteAnswerUseCase } from "./delete-answer.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment.js";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("answer-1"),
    );

    inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("1"),
      }),

      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      authorId: "author-1",
      answerId: "answer-1",
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newanswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("answer-1"),
    );

    inMemoryAnswersRepository.create(newanswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: "answer-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
