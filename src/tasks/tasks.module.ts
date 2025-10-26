import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TASKS_REPOSITORY',
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => TasksRepository(dataSource),
    },
  ],
})
export class TasksModule {}
