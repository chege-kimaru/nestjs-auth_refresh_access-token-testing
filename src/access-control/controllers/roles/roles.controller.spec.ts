import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '~/access-control/services/roles/roles.service';
import { RolesController } from './roles.controller';
jest.mock('~/access-control/services/roles/roles.service');

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
