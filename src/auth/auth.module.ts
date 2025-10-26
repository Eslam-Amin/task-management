import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    AuthService,
    {
      provide: 'USERS_REPOSITORY',
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => UsersRepository(dataSource),
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
