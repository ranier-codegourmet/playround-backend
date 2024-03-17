import { Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard, UseUserCredentials } from '@repo/nest-auth-module';
import { User } from '@repo/nest-user-module';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @UseUserCredentials() user: User,
  ): Promise<{ access_token: string }> {
    this.logger.log(`Login User: ${user._id}`);

    const token = await this.authService.generateOrganizationToken(user);

    return {
      access_token: token,
    };
  }
}
