import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import { DeleteQuestionUseCase } from "./delete-question.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { makeQuestionAttachment } from "test/factories/make-question-attachment.js";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete Question", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("1"),
      }),

      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId("2"),
      }),
    );

    await sut.execute({
      authorId: "author-1",
      questionId: "question-1",
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: "author-2",
      questionId: "question-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
