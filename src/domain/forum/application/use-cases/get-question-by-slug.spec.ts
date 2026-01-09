import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug.js";
import { makeQuestion } from "test/factories/make-question.js";
import { Slug } from "../../enterprise/entities/value-objects/slug.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Questions By Slug Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("example-question"),
    });

    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
