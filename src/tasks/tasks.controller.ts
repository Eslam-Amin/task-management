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
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { ApiResponse } from 'src/dto/api-response';

@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filter: GetTasksFilterDto,
  ): Promise<ApiResponse<Task> | Task[]> {
    const { tasks, tasksCount } = await this.tasksService.getAllTasks(filter);
    return {
      pagination: {
        totalItems: tasksCount,
        totalPages: Math.ceil(tasksCount / 10),
        currentPage: 1,
        itemsPerPage: 10,
      },
      data: tasks,
    };
  }

  @Post()
  createTask(@Body() body: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(body);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() body: Partial<CreateTaskDto>,
  ) {
    const task = await this.tasksService.updateTaskById(id, body);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const { status } = updateTaskStatusDto;
    const task = await this.tasksService.updateTaskStatus(id, status);
    return {
      message: ' Task status updated successfully',
      data: task,
    };
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return { message: 'Task deleted successfully', data: {} };
  }
}
