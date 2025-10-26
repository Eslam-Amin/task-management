import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(@Inject('TASKS_REPOSITORY') private tasksRepository) {}

  async getAllTasks(
    filter: GetTasksFilterDto,
  ): Promise<{ tasks: Task[]; tasksCount: number }> {
    const tasksCount = await this.tasksRepository.getTasksCount(filter);
    const tasks = await this.tasksRepository.getTasks(filter);
    return { tasksCount, tasks };
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async updateTaskById(id: string, attrs: Partial<Task>): Promise<Task> {
    const task = await this.getTaskById(id);
    Object.assign(task, attrs);
    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    const task = await this.getTaskById(id);
    task.status = status;
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id });
    if (!result.affected)
      throw new NotFoundException(`Task with ID "${id}" not found`);
  }
}
