import { DataSource } from 'typeorm';
import { User } from './user.entity';
export const UsersRepository = (dataSource: DataSource) =>
  dataSource.getRepository(User).extend({});
