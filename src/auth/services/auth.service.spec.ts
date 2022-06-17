import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '~/shared/utils/mock.type';
import { repositoryMockFactory } from '~/shared/utils/repository-mock.factory';
import { User } from '~/users/entities/user.entity';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import * as bcrypt from 'bcrypt';
jest.mock('./refresh-token.service');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepositoryMock: MockType<Repository<User>>;
  let refreshTokenServiceMock: RefreshTokenService;
  let jwtServiceMock: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        RefreshTokenService,
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          }
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    refreshTokenServiceMock = module.get<RefreshTokenService>(RefreshTokenService);
    jwtServiceMock = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are correct', async () => {
      let username = 'Username';
      let password = 'password';

      const lowercaseUsername = 'username';

      const userByCredentials = new User();
      userByCredentials.id = 'uuid';
      userByCredentials.username = lowercaseUsername;
      userByCredentials.password = 'hashedPassword';

      jest.spyOn(authService, 'findUserByCredentials').mockResolvedValue(userByCredentials);

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;


      const userById = new User();
      jest.spyOn(authService, 'findUserById').mockResolvedValue(userById);

      const returnedUser = await authService.validateUser(username, password);

      expect(authService.findUserByCredentials).toHaveBeenCalledWith(lowercaseUsername);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, userByCredentials.password);
      expect(authService.findUserById).toHaveBeenCalledWith(userByCredentials.id);
      expect(returnedUser).toEqual(userById);
    });

    it('should should return null if username is wrong', async () => {
      let username = 'username';
      let password = 'password';

      jest.spyOn(authService, 'findUserByCredentials').mockResolvedValue(null);

      const bcryptCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const returnedUser = await authService.validateUser(username, password);

      expect(authService.findUserByCredentials).toHaveBeenCalledWith(username);
      expect(returnedUser).toBeNull();
    });

    it('should return null if password is wrong', async () => {
      let username = 'username';
      let password = 'password';

      const user = new User();
      jest.spyOn(authService, 'findUserByCredentials').mockResolvedValue(user);

      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const returnedUser = await authService.validateUser(username, password);

      expect(authService.findUserByCredentials).toHaveBeenCalledWith(username);
      expect(returnedUser).toBeNull();
    });

    it('should return null if both username and password are wrong', async () => {
      let username = 'username';
      let password = 'password';

      jest.spyOn(authService, 'findUserByCredentials').mockResolvedValue(null);

      const bcryptCompare = jest.fn().mockResolvedValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const returnedUser = await authService.validateUser(username, password);

      expect(authService.findUserByCredentials).toHaveBeenCalledWith(username);
      expect(returnedUser).toBeNull();
    });
  });

  describe('loginFromRefreshToken', () => {
    it('should generate an access token and refresh token if refresh token is not passed', async () => {
      const user = new User();
      user.id = 'uuid';
      const refreshToken = 'refresh_token';
      const generatedAccessToken = 'access_token';
      const newRefreshToken = 'new_refresh_token';

      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue(generatedAccessToken);
      jest.spyOn(refreshTokenServiceMock, 'generateRefreshToken').mockResolvedValue(newRefreshToken);

      const result = await authService.login(user);

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
      expect(refreshTokenServiceMock.generateRefreshToken).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        user,
        payload: {
          type: 'bearer',
          access_token: generatedAccessToken,
          refresh_token: newRefreshToken
        }
      });
    });

    it('should reuse a refresh token if one is passed', async () => {
      const user = new User();
      user.id = 'uuid';
      const refreshToken = 'refresh_token';
      const generatedAccessToken = 'access_token';

      jest.spyOn(jwtServiceMock, 'signAsync').mockResolvedValue(generatedAccessToken);

      const result = await authService.login(user, refreshToken);

      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
      expect(result).toEqual({
        user,
        payload: {
          type: 'bearer',
          access_token: generatedAccessToken,
          refresh_token: refreshToken
        }
      });
    });
  });

  describe('logout', () => {
    it('should call RefreshTokenService.revokeRefreshToken', async () => {
      const refreshToken = 'refresh_token';
      jest.spyOn(refreshTokenServiceMock, 'revokeRefreshToken').mockResolvedValue(null);

      const result = await authService.logout(refreshToken);

      expect(refreshTokenServiceMock.revokeRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual({});
    });
  });

  describe('findUserById', () => {

    it('should find user by id', async () => {
      const id = 'uuid';
      const user = new User();
      user.id = id;

      jest.spyOn(userRepositoryMock, 'findOneBy').mockReturnValue(user);

      const result = await authService.findUserById(id);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(user);
    })

  })

  describe('findUserByCredentials', () => {

    it('should find user by username and password', async () => {
      const username = 'username';
      const user = new User();
      user.username = username;

      jest.spyOn(userRepositoryMock, 'findOne').mockReturnValue(user);

      const result = await authService.findUserByCredentials(username);

      expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { username },
        select: ['id', 'username', 'password']
      });
      expect(result).toEqual(user);
    })

  })
});
