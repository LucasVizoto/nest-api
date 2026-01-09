import { expect, describe, beforeEach, it } from "vitest";
import { makeAnswer } from "test/factories/make-answer.js";
import { CommentOnAnswerUseCase } from "./comment-on-answer.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    );

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  it("should be able to comment on a answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentario teste",
    });

    expect(inMemoryAnswerCommentsRepository.items[0]?.content).toEqual(
      "Comentario teste",
    );
  });
});
