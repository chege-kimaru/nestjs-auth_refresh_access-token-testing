import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '~/shared/utils/mock.type';
import { repositoryMockFactory } from '~/shared/utils/repository-mock.factory';
import { User } from '~/users/entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let userRepositoryMock: MockType<Repository<User>>;
  let refreshTokenRepositoryMock: MockType<Repository<RefreshToken>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        {
          provide: JwtService, useValue: {
            signAsync: jest.fn(),
          }
        },
        {
          provide: ConfigService, useValue: {
            get: jest.fn(),
          }
        },
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(RefreshToken), useFactory: repositoryMockFactory },
      ],
    }).compile();

    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    refreshTokenRepositoryMock = module.get(getRepositoryToken(RefreshToken));
  });

  it('should be defined', () => {
    expect(refreshTokenService).toBeDefined();
  });
});
