import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
@ApiTags('Api Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Api Status' })
  @Public()
  @Get()
  getApiStatus(): { message: string } {
    return this.appService.getApiStatus();
  }
}
