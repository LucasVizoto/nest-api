import { expect, describe, beforeEach, it } from "vitest";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository.js";
import { FetchAnswerCommentsUseCase } from "./fetch-many-answer-comments.js";
import { makeAnswerComment } from "test/factories/make-answer-comment.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";
import { makeStudent } from "test/factories/make-student.js";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Answers", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = await makeStudent({
      name: "Jhon Doe",
    });

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId("answer-1"),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(comment1);
    await inMemoryAnswerCommentsRepository.create(comment2);
    await inMemoryAnswerCommentsRepository.create(comment3);

    const result = await sut.execute({
      answerId: "answer-1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: "Jhon Doe",
          commentId: comment1.id.toString(),
        }),
        expect.objectContaining({
          author: "Jhon Doe",
          commentId: comment2.id.toString(),
        }),
        expect.objectContaining({
          author: "Jhon Doe",
          commentId: comment3.id.toString(),
        }),
      ]),
    );
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = await makeStudent({
      name: "Jhon Doe",
    });

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId(`answer-1`),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: "answer-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
