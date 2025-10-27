import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
export const UsersRepository = (dataSource: DataSource) => {
  const logger = new Logger('UsersRepository', { timestamp: true });
  return dataSource.getRepository(User).extend({
    async createUser(authCredentials: AuthCredentialsDto): Promise<User> {
      const { username, password } = authCredentials;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({ username, password: hashedPassword });
      try {
        return await this.save(user);
      } catch (error) {
        if (error.code === '23505') {
          logger.error(`Username "${username}" already exists.`);
          throw new ConflictException('Username already exists');
        } else {
          logger.error(`Failed to create user "${username}".`, error.stack);
          throw new InternalServerErrorException(
            'Failed to create user: ' + error.message,
          );
        }
      }
    },
  });
};
