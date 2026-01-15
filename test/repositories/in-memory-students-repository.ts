import { DomainEvents } from "@/core/events/domain-events.js";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  constructor() {}

  async findByEmail(email: string) {
    const students = this.items.find((item) => item.email === email);

    if (!students) {
      return null;
    }

    return students;
  }

  async create(student: Student) {
    this.items.push(student);
    DomainEvents.dispatchEventsForAggregate(student.id);
  }
}
