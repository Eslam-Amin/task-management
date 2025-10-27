import { DataSource } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filte.dto';
import { User } from 'src/auth/user.entity';

export const TasksRepository = (dataSource: DataSource) => {
  return dataSource.getRepository(Task).extend({
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
      const { title, description } = createTaskDto;
      const task = this.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
      });
      return this.save(task);
    },

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
      console.log('🚀 ~ TasksRepository ~ user:', user);
      const { status, search } = filterDto;
      const query = this.createQueryBuilder('task').where({ user });

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (search) {
        query.andWhere(
          '(task.title ILIKE :search OR task.description ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      return query.getMany();
    },

    async getTasksWithCount(
      filterDto: GetTasksFilterDto,
      user: User,
    ): Promise<{ tasks: Task[]; tasksCount: number }> {
      const tasks = await this.getTasks(filterDto, user);
      const tasksCount = await this.getTasksCount(filterDto, user);

      return {
        tasks,
        tasksCount,
      };
    },

    async getTasksCount(
      filterDto: GetTasksFilterDto,
      user: User,
    ): Promise<number> {
      const { status, search } = filterDto;
      const query = this.createQueryBuilder('task').where({ user });

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
};
