import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
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
