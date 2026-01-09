import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  QuestionAttachment,
  type QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment.js";

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
