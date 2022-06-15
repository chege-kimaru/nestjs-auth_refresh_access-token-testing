import { Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PathRole } from '~/access-control/decorators/path-role.decorator';
import { PathUser } from '~/access-control/decorators/path-user.decorator';
import { Role } from '~/access-control/entities/role.entity';
import { UserRolesService } from '~/access-control/services/user-roles/user-roles.service';
import { User } from '~/users/entities/user.entity';

// ! TODO: Authorize only admin

@ApiTags('User Roles')
@Controller('users/:userId/roles')
export class UserRolesController {

    constructor(private userRolesService: UserRolesService) { }

    @ApiOperation({ summary: 'Get user roles' })
    @ApiBearerAuth()
    @ApiResponse({ type: Role, isArray: true })
    @ApiParam({ name: 'userId', type: String })
    @Get()
    getUserRoles(@PathUser() user: User): Promise<Role[]> {
        return this.userRolesService.getUserRoles(user);
    }

    @ApiOperation({ summary: 'Add role to user' })
    @ApiBearerAuth()
    @ApiResponse({ type: Role, status: 200, isArray: true })
    @ApiParam({ name: 'userId', type: String })
    @ApiParam({ name: 'roleId', type: String })
    @HttpCode(200)
    @Post(':roleId')
    addUserRole(@PathUser() user: User, @PathRole() role: Role): Promise<Role[]> {
        return this.userRolesService.addUserRole(user, role);
    }

    @ApiOperation({ summary: 'Remove role from user' })
    @ApiBearerAuth()
    @ApiResponse({ type: Role, status: 200, isArray: true })
    @ApiParam({ name: 'userId', type: String })
    @ApiParam({ name: 'roleId', type: String })
    @HttpCode(200)
    @Delete(':roleId')
    removeUserRole(@PathUser() user: User, @PathRole() role: Role): Promise<Role[]> {
        return this.userRolesService.removeUserRole(user, role);
    }
}
