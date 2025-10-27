import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { ApiResponse } from 'src/dto/api-response';
import { User } from './user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller({ path: 'auth', version: '1' })
@Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<void | User | ApiResponse<User>> {
    const user = await this.authService.signUp(authCredentialsDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<
    { accessToken: string } | ApiResponse<{ accessToken: string; user: User }>
  > {
    const { accessToken, user } =
      await this.authService.signIn(authCredentialsDto);
    return {
      message: 'User signed in successfully',
      data: { ...user, accessToken },
    };
  }
}
