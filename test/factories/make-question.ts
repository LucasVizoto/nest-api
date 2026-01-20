import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  Question,
  type QuestionProps,
} from "@/domain/forum/enterprise/entities/question.js";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";

export function makeQuestion(
  override: Partial<QuestionProps> = {}, // pode receber qualquer propriedade de questionprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const newQuestion = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return newQuestion;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
