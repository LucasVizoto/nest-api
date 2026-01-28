import { expect, describe, beforeEach, it } from "vitest";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository.js";
import { FetchQuestionCommentsUseCase } from "./fetch-many-question-comments.js";
import { makeQuestionComment } from "test/factories/make-question-comment.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";
import { makeStudent } from "test/factories/make-student.js";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Question Answers", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({
      name: "Jhon Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityId("question-1"),
      authorId: student.id,
    });
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityId("question-1"),
      authorId: student.id,
    });
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityId("question-1"),
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment1);
    await inMemoryQuestionCommentsRepository.create(comment2);
    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: "question-1",
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

  it("should be able to fetch paginated question comments", async () => {
    const student = makeStudent({
      name: "Jhon Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId(`question-1`),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
