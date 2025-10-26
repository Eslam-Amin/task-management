import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
import { Transform } from 'class-transformer';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  search?: string;
}
