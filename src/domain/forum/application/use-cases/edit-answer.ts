import { left, right, type Either } from "@/core/either.js";
import { Answer } from "../../enterprise/entities/answer.js";
import { AnswerRepository } from "../repositories/answers-repository.js";
import { ResourceNotFoundError } from "./errors/resourse-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository.js";
import { Injectable } from "@nestjs/common";

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentIds: string[];
}
type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(answerAttachments);
    answer.attachments = answerAttachmentList;
    answer.content = content;

    await this.answerRepository.save(answer);

    return right({
      answer,
    });
  }
}
