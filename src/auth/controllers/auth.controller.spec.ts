import { Test, TestingModule } from '@nestjs/testing';
import { User } from '~/users/entities/user.entity';
import { RefreshDto } from '../dto/refresh.dto';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
jest.mock('../services/auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login', () => {
      const user = new User();
      controller.login(user);
      expect(authService.login).toHaveBeenCalledWith(user);
    })
  });

  describe('refresh', () => {
    it('should call AuthService.loginFromRefreshToken', () => {
      const refreshDto: RefreshDto = { refreshToken: 'refreshToken' };
      controller.refresh(refreshDto);
      expect(authService.loginFromRefreshToken).toHaveBeenCalledWith(refreshDto.refreshToken);
    })
  });

  describe('logout', () => {
    it('should call AuthService.logout', () => {
      const refreshDto: RefreshDto = { refreshToken: 'refreshToken' };
      controller.logout(refreshDto);
      expect(authService.logout).toHaveBeenCalledWith(refreshDto.refreshToken);
    })
  });

  describe('getProfile', () => {
    it('should return the current user profile', () => {
      const user = new User();
      expect(controller.getProfile(user)).toEqual(user);
    })
  });
});
