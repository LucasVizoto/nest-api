import { expect, describe, beforeEach, it } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions.repository.js";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug.js";
import { makeQuestion } from "test/factories/make-question.js";
import { Slug } from "../../enterprise/entities/value-objects/slug.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository.js";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository.js";
import { makeStudent } from "test/factories/make-student.js";
import { makeAttachment } from "test/factories/make-attachment.js";
import { makeQuestionAttachment } from "test/factories/make-question-attachment.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Questions By Slug Question", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({
      name: "Jhon Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    const attachment = makeAttachment({
      title: "Some attachment",
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("example-question"),
    });

    inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: "Jhon Doe",
        attachments: [
          expect.objectContaining({
            title: "Some attachment",
          }),
        ],
      }),
    });
  });
});
