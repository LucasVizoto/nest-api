import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment.js";
import { makeQuestionComment } from "test/factories/make-question-comment.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();

    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question comment from another user", async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId("author-1"),
    });

    await inMemoryQuestionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
  });
});
