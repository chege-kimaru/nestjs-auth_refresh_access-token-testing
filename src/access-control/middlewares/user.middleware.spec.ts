import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesService } from '../services/user-roles/user-roles.service';
import { UserMiddleware } from './user.middleware';
jest.mock('../services/user-roles/user-roles.service');

describe('UserMiddleware', () => {
  let userMiddleware: UserMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMiddleware,
        UserRolesService
      ],
    }).compile();

    userMiddleware = module.get<UserMiddleware>(UserMiddleware);
  });

  it('should be defined', () => {
    expect(userMiddleware).toBeDefined();
  });
});
