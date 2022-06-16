import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '~/access-control/entities/user-role.entity';
import { MockType } from '~/shared/utils/mock.type';
import { repositoryMockFactory } from '~/shared/utils/repository-mock.factory';
import { User } from '~/users/entities/user.entity';
import { UserRolesService } from './user-roles.service';

describe('UserRolesService', () => {
  let service: UserRolesService;
  let userRepositoryMock: MockType<Repository<User>>;
  let userRoleRespoditoyMock: MockType<Repository<UserRole>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolesService,
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(UserRole), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<UserRolesService>(UserRolesService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    userRoleRespoditoyMock = module.get(getRepositoryToken(UserRole));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
