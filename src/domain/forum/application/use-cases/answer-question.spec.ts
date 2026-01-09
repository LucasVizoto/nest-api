import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { AnswerQuestionUseCase } from "./answer-question.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Create Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      questionId: "1",
      instructorId: "2",
      content: "Conteúdo da resposta",
      attachmentIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]?.id).toEqual(
      result.value?.answer.id,
    );
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryAnswersRepository.items[0]?.attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });
});
