import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  getApiStatus(): { message: string } {
    return { message: 'FRETERIUM API UP' };
  }
}
