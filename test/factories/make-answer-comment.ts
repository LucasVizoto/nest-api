import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  AnswerComment,
  type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment.js";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {}, // pode receber qualquer propriedade de answercommentprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const newAnswerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return newAnswerComment;
}
