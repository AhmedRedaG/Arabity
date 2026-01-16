import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus(): string {
    return 'API is running but it may take about 30-50 seconds to wake up if it was idle.';
  }
}
