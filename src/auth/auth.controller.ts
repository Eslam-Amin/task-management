import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { ApiResponse } from 'src/dto/api-response';
import { User } from './user.entity';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<ApiResponse<User>> {
    const user = await this.authService.signUp(authCredentialsDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }
}
