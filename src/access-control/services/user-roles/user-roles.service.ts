import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/access-control/entities/role.entity';
import { UserRole } from '~/access-control/entities/user-role.entity';
import { User } from '~/users/entities/user.entity';

@Injectable()
export class UserRolesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) { }

    async getUser(userId: string): Promise<User> {
        return this.userRepository.findOneBy({ id: userId });
    }

    async getUserRoles(user: User): Promise<Role[]> {
        user = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['roles']
        });
        return user.roles;
    }

    async addUserRole(user: User, role: Role): Promise<Role[]> {
        const dto = { userId: user.id, roleId: role.id };
        const exitingUserRole = await this.userRoleRepository.findOne({
            where: dto
        });
        if (exitingUserRole) throw new ForbiddenException('User already has this role');

        await this.userRoleRepository.save(dto);

        return this.getUserRoles(user);
    }

    async removeUserRole(user: User, role: Role): Promise<Role[]> {
        const dto = { userId: user.id, roleId: role.id };
        const exitingUserRole = await this.userRoleRepository.findOne({
            where: dto
        });
        if (!exitingUserRole) throw new ForbiddenException('User does not have this role');

        await this.userRoleRepository.delete(exitingUserRole.id);

        return this.getUserRoles(user);
    }
}
