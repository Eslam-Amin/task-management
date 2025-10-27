import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@Inject('TASKS_REPOSITORY') private tasksRepository) {}

  async getAllTasks(
    filter: GetTasksFilterDto,
    user: User,
  ): Promise<{ tasks: Task[]; tasksCount: number }> {
    const { tasks, tasksCount } = await this.tasksRepository.getTasksWithCount(
      filter,
      user,
    );
    return { tasksCount, tasks };
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async updateTaskById(
    id: string,
    user: User,
    attrs: Partial<Task>,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    Object.assign(task, attrs);
    return this.tasksRepository.save(task);
  }

  async updateTaskStatus(id: string, user: User, status: TaskStatus) {
    const task = await this.updateTaskById(id, user, { status });
    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      user: { id: user.id },
    });
    if (!result.affected)
      throw new NotFoundException(`Task with ID "${id}" not found`);
  }
}
