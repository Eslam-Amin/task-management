import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { ApiResponse } from '../dto/api-response';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { TaskDto } from './dto/task.dto';

@Controller({ path: 'tasks', version: '1' })
@UseGuards(AuthGuard())
@Serialize(TaskDto)
export class TasksController {
  constructor(private tasksService: TasksService) {}
  private logger = new Logger('TasksController');
  @Get()
  async getTasks(
    @Query() filter: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<Task> | Task[]> {
    const { tasks, tasksCount } = await this.tasksService.getAllTasks(
      filter,
      user,
    );
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filter,
      )}`,
    );
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
  async createTask(
    @Body() body: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<Task>> {
    const task = await this.tasksService.createTask(body, user);
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        body,
      )}`,
    );
    return {
      message: 'Task created successfully',
      data: task,
    };
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string, @GetUser() user: User) {
    const task = await this.tasksService.getTaskById(id, user);
    return {
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  @Patch('/:id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() body: Partial<CreateTaskDto>,
    @GetUser() user: User,
  ) {
    const task = await this.tasksService.updateTaskById(id, user, body);
    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    const { status } = updateTaskStatusDto;
    const task = await this.tasksService.updateTaskStatus(id, user, status);
    return {
      message: ' Task status updated successfully',
      data: task,
    };
  }

  @Delete('/:id')
  async deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
    await this.tasksService.deleteTask(id, user);
    return { message: 'Task deleted successfully', data: {} };
  }
}
