import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
@Injectable()
export class TasksService {
  constructor() {}
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filter: GetTasksFilterDto): Task[] {
    let tasks = this.getAllTasks();
    const { status, search } = filter;
    if (filter.status) tasks = tasks.filter((task) => task.status === status);
    if (search)
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    return tasks;
  }

  createTask(createTskDto: CreateTaskDto): Task {
    const { title, description } = createTskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) throw new NotFoundException(`Task with id: ${id} not found`);
    return task;
  }

  updateTaskById(id: string, attrs: Partial<Task>): Task {
    let existingTask = this.getTaskById(id);
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        const updatedTask = { ...task, ...attrs };
        existingTask = updatedTask;
        return updatedTask;
      }
      return task;
    });
    return existingTask;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.updateTaskById(id, { status });
    return task;
  }

  deleteTask(id: string): Task[] {
    const task = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks;
  }
}
