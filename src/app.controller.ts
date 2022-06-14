import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@ApiTags('Api Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Api Status' })
  @Get()
  getApiStatus(): { message: string } {
    return this.appService.getApiStatus();
  }
}
