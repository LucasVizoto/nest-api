import { expect, describe, beforeEach, it } from "vitest";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer.js";
import { makeQuestion } from "test/factories/make-question.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository.js";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Chose question Best Answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    );
  });

  it("should be able to choose the question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0]?.bestAnswerId).toEqual(
      answer.id,
    );
  });

  it("should not be able to choose another user question best answer", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });

    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    const newanswer = makeAnswer(
      {
        authorId: new UniqueEntityId("author-1"),
      },
      new UniqueEntityId("answer-1"),
    );

    inMemoryAnswersRepository.create(newanswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: answer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
