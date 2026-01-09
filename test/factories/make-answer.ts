import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  Answer,
  type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer.js";

export function makeAnswer(
  override: Partial<AnswerProps> = {}, // pode receber qualquer propriedade de questionprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const newAnswer = Answer.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return newAnswer;
}
