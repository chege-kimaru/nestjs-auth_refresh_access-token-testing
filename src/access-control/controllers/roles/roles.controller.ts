import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PathRole } from '~/access-control/decorators/path-role.decorator';
import { RoleDto } from '~/access-control/dto/role.dto';
import { Role } from '~/access-control/entities/role.entity';
import { RolesService } from '~/access-control/services/roles/roles.service';

// ! TODO: Authorize only admin

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @ApiOperation({ summary: 'Get all roles' })
    @ApiBearerAuth()
    @ApiResponse({ type: Role, isArray: true })
    @Get()
    async getAllRoles(): Promise<Role[]> {
        return this.rolesService.getAllRoles();
    }

    @ApiOperation({ summary: 'Add a role' })
    @ApiBearerAuth()
    @ApiBody({ type: RoleDto })
    @ApiResponse({ type: Role, status: 201 })
    @Post()
    async createRole(@Body() dto: RoleDto): Promise<Role> {
        return this.rolesService.createRole(dto);
    }

    @ApiOperation({ summary: 'Get a role' })
    @ApiBearerAuth()
    @ApiResponse({ type: Role })
    @ApiParam({ name: 'roleId', type: String })
    @Get(':roleId')
    async getRole(@PathRole() role: Role): Promise<Role> {
        return role;
    }

    @ApiOperation({ summary: 'Update a role' })
    @ApiBearerAuth()
    @ApiBody({ type: RoleDto })
    @ApiResponse({ type: Role, status: 200 })
    @ApiParam({ name: 'roleId', type: String })
    @Put(':roleId')
    async updateRole(@PathRole() role: Role, @Body() dto: RoleDto): Promise<Role> {
        return this.rolesService.updateRole(role, dto);
    }

    @ApiOperation({ summary: 'Delete a role' })
    @ApiBearerAuth()
    @ApiResponse({ type: Object, status: 204 })
    @ApiParam({ name: 'roleId', type: String })
    @Delete(':roleId')
    async deleteRole(@PathRole() role: Role): Promise<{}> {
        return this.rolesService.deleteRole(role);
    }
}
