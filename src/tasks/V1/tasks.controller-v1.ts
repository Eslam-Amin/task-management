import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksServiceV1 } from './tasks.service-v1';
import { TaskStatus } from '../task-status.enum';
import { CreateTaskDto } from '../dto/create-task.dto';
import { GetTasksFilterDto } from '../dto/get-tasks-filte.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { Task } from '../task.entity';

@Controller({ path: 'tasks', version: '1' })
export class TasksControllerV1 {
  constructor(private tasksService: TasksServiceV1) {}

  @Get()
  getTasks(@Query() filter: GetTasksFilterDto): Task[] {
    if (Object.keys(filter))
      return this.tasksService.getTasksWithFilters(filter);
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  updateTaskById(
    @Param('id') id: string,
    @Body() body: Partial<CreateTaskDto>,
  ) {
    return this.tasksService.updateTaskById(id, body);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
