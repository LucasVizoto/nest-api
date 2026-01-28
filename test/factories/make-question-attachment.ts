import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {}, // pode receber qualquer propriedade de questionattachmentprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps> = {},
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });
    return questionAttachment;
  }
}
