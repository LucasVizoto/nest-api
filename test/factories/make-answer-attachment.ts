import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  AnswerAttachment,
  type AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment.js";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {}, // pode receber qualquer propriedade de answerattachmentprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return answerAttachment;
}
