import { expect, describe, beforeEach, it } from "vitest";
import { CreateQuestionUseCase } from "./create-question.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova Pergunta",
      content: "Conteúdo da pergunta",
      attachmentIds: ["1", "2"],
    });

    expect(result.isLeft()).toBe(false);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question,
    );
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });

  it("should persist attachmens when creating a new questio", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova Pergunta",
      content: "Conteúdo da pergunta",
      attachmentIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0]).toHaveLength(2);
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachment: new UniqueEntityId("1"),
        }),
        expect.objectContaining({
          attachment: new UniqueEntityId("2"),
        }),
      ]),
    );
  });
});
