import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  QuestionComment,
  type QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment.js";

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {}, // pode receber qualquer propriedade de questioncommentprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const newQuestionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return newQuestionComment;
}
