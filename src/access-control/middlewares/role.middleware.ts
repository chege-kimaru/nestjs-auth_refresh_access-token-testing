import { Injectable, Logger, NestMiddleware, NotFoundException } from '@nestjs/common';
import { RolesService } from '../services/roles/roles.service';

@Injectable()
export class RoleMiddleware implements NestMiddleware {

  constructor(private rolesService: RolesService) { }

  async use(req: any, res: any, next: () => void) {
    const role = await this.rolesService.getRole(req.params.roleId);

    if (!role) throw new NotFoundException('Role not found');

    req.Role = role;
    next();
  }
}
