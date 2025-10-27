import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_REPOSITORY') private usersRepository) {}
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void | User> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password)))
      return 'Signed in successfully';
    else throw new UnauthorizedException('Invalid credentials');
  }
}
