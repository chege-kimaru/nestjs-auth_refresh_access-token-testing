import { Injectable, Logger, NestMiddleware, NotFoundException } from '@nestjs/common';
import { UserRolesService } from '../services/user-roles/user-roles.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {

  constructor(private userRolesService: UserRolesService) { }

  async use(req: any, res: any, next: () => void) {
    const user = await this.userRolesService.getUser(req.params.userId);

    if (!user) throw new NotFoundException('User not found');

    req.User = user;
    next();
  }
}
