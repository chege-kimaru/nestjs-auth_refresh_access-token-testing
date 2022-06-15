import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleDto } from '~/access-control/dto/role.dto';
import { Role } from '~/access-control/entities/role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async getRole(roleId: string): Promise<Role> {
        return this.roleRepository.findOneBy({ id: roleId });
    }

    async createRole(dto: RoleDto): Promise<Role> {
        return this.roleRepository.save(dto);
    }

    async updateRole(role: Role, dto: RoleDto): Promise<Role> {
        await this.roleRepository.update(role.id, dto);
        return this.getRole(role.id);
    }

    async deleteRole(role: Role): Promise<{}> {
        await this.roleRepository.delete(role.id);
        return {};
    }
}
