import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { makeQuestion } from "test/factories/make-question.js";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { CommentOnQuestionUseCase } from "./comment-on-question.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    );

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it("should be able to comment on a question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentario teste",
    });

    expect(inMemoryQuestionCommentsRepository.items[0]?.content).toEqual(
      "Comentario teste",
    );
  });
});
