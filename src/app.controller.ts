import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  redirect() {
    return {
      api_status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API is running',
      api: '/api',
      swagger: '/api/swagger',
    };
  }
}
