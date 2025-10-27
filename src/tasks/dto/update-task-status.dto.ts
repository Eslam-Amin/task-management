import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, { message: 'Status must be a valid TaskStatus' })
  status: TaskStatus;
}
