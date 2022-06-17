import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/access-control/entities/role.entity';
import { MockType } from '~/shared/utils/mock.type';
import { repositoryMockFactory } from '~/shared/utils/repository-mock.factory';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRespositoryMock: MockType<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesRespositoryMock = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
