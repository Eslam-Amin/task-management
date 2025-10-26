import { DataSource } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';

export const TasksRepository = (dataSource: DataSource) =>
  dataSource.getRepository(Task).extend({
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
      const { title, description } = createTaskDto;
      const task = this.create({
        title,
        description,
        status: TaskStatus.OPEN,
      });
      return this.save(task);
    },

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
      const { status, search } = filterDto;
      const query = this.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          '(task.title LIKE :search OR task.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      return query.getMany();
    },

    async getTasksWithCount(
      filterDto: GetTasksFilterDto,
    ): Promise<{ tasks: Task[]; tasksCount: number }> {
      const tasks = await this.getTasks(filterDto);
      const tasksCount = await this.getTasksCount(filterDto);

      return {
        tasks,
        tasksCount,
      };
    },

    async getTasksCount(filterDto: GetTasksFilterDto): Promise<number> {
      const { status, search } = filterDto || {};
      const query = this.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      if (search) {
        query.andWhere(
          '(task.title LIKE :search OR task.description LIKE :search)',
          { search: `%${search}%` },
        );
      }

      return query.getCount();
    },

    async findByStatus(status: string) {
      return this.find({ where: { status } });
    },
  });
