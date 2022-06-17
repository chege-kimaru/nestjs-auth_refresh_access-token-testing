import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesService } from '~/access-control/services/user-roles/user-roles.service';
import { UserRolesController } from './user-roles.controller';

jest.mock('~/access-control/services/user-roles/user-roles.service');

describe('UserRolesController', () => {
  let controller: UserRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [UserRolesService]
    }).compile();

    controller = module.get<UserRolesController>(UserRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
