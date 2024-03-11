import {
  Body,
  Controller,
  Logger,
  NotImplementedException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard, UseUserCredentials } from '@repo/nest-auth-module';
import { User } from '@repo/nest-user-module';

import { CreateUserDTO } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @UseUserCredentials() user: User
  ): Promise<{ access_token: string }> {
    this.logger.log(`Login User: ${user._id}`);

    const token = await this.authService.generateOrganizationToken(user);

    return {
      access_token: token,
    };
  }

  // TODO: disable registration until we can launch the system to the public
  @Post('register')
  async register(
    @Body() payload: CreateUserDTO
  ): Promise<{ access_token: string }> {
    throw new NotImplementedException('Registration is disabled');

    this.logger.log(`Register User: ${payload.email}`);

    const user = await this.authService.createUser(payload);

    const token = await this.authService.generateToken(user);

    return {
      access_token: token,
    };
  }
}
