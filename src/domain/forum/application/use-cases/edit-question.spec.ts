import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { EditQuestionUseCase } from "./edit-question.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { makeQuestionAttachment } from "test/factories/make-question-attachment.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository,
    );
  });

  it("should be able to edit a question", async () => {
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
      questionId: newQuestion.id.toString(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
    ]);
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("question-1"),
    );

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: "author-2",
      questionId: newQuestion.id.toString(),
      title: "Pergunta teste",
      content: "Conteúdo teste",
      attachmentIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
