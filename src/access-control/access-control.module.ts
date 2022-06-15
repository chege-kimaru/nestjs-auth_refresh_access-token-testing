import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { RolesService } from './services/roles/roles.service';
import { RolesController } from './controllers/roles/roles.controller';
import { User } from '~/users/entities/user.entity';
import { UserRolesController } from './controllers/user-roles/user-roles.controller';
import { UserRolesService } from './services/user-roles/user-roles.service';
import { UserMiddleware } from './middlewares/user.middleware';
import { RoleMiddleware } from './middlewares/role.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, UserRole, User])
    ],
    providers: [RolesService, UserRolesService],
    controllers: [RolesController, UserRolesController]
})
export class AccessControlModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserMiddleware)
            .forRoutes(
                // * The * is to allow for versioning eg /v3/users
                // * We could have used UserRolesController but again the versioning would be ommitted
                // in this version and hence won't work
                { path: '*/users/:userId/roles*', method: RequestMethod.ALL },
            )
            .apply(RoleMiddleware)
            .forRoutes(
                { path: '*/roles/:roleId', method: RequestMethod.GET },
                { path: '*/roles/:roleId', method: RequestMethod.PUT },
                { path: '*/roles/:roleId', method: RequestMethod.DELETE },
                { path: '*/users/:userId/roles/:roleId', method: RequestMethod.POST },
                { path: '*/users/:userId/roles/:roleId', method: RequestMethod.DELETE },
            )
    }

}
