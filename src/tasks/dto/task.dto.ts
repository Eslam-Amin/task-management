import { Expose } from 'class-transformer';
import { TaskStatus } from '../task-status.enum';
import { User } from 'src/auth/user.entity';

export class TaskDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: TaskStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  user: User;
}
