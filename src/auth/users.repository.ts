import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
export const UsersRepository = (dataSource: DataSource) =>
  dataSource.getRepository(User).extend({
    async createUser(authCredentials: AuthCredentialsDto): Promise<User> {
      const { username, password } = authCredentials;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({ username, password: hashedPassword });
      try {
        return await this.save(user);
      } catch (error) {
        if (error.code === '23505')
          throw new ConflictException('Username already exists');
        else
          throw new InternalServerErrorException(
            'Failed to create user: ' + error.message,
          );
      }
    },
  });
