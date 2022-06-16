import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../services/roles/roles.service';
import { RoleMiddleware } from './role.middleware';
jest.mock('../services/roles/roles.service');

describe('RoleMiddleware', () => {
  let roleMiddleware: RoleMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleMiddleware,
        RolesService
      ],
    }).compile();

    roleMiddleware = module.get<RoleMiddleware>(RoleMiddleware);
  });

  it('should be defined', () => {
    expect(roleMiddleware).toBeDefined();
  });
});
