import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import {
  Student,
  type StudentProps,
} from "@/domain/forum/enterprise/entities/student.js";

export function makeStudent(
  override: Partial<StudentProps> = {}, // pode receber qualquer propriedade de studentprop mas sendo todas opcionais
  id?: UniqueEntityId,
) {
  const newStudent = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override, // com isso, caso eu queira mudar alguma informação, posso passar como param e ele vai subescrever
    },
    id,
  );

  return newStudent;
}
