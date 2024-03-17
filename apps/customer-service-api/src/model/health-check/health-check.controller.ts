import { Controller, Get, Logger } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  private logger: Logger = new Logger(HealthCheckController.name);

  @Get()
  async healthCheck() {
    this.logger.log(`Health check`);

    return { status: 'ok' };
  }
}
