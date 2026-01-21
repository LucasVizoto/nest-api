import { left, right, type Either } from "@/core/either.js";
import { Question } from "../../enterprise/entities/question.js";
import { QuestionRepository } from "../repositories/questions-repository.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments=repository.js";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list.js";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Injectable } from "@nestjs/common";

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentIds: string[];
}
type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

@Injectable()
export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);
    question.attachments = questionAttachmentList;

    question.title = title;
    question.content = content;

    await this.questionRepository.save(question);

    return right({
      question,
    });
  }
}
