import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockType } from '~/shared/utils/mock.type';
import { repositoryMockFactory } from '~/shared/utils/repository-mock.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should save user', async () => {
      const dto: CreateUserDto = {
        username: 'username',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        mobile: 'mobile'
      };
      const unhashedPassword = dto.password;

      jest.spyOn(service, 'findUserByUsername').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash');
      jest.spyOn(userRepositoryMock, 'save').mockReturnValue(new User());
      jest.spyOn(service, 'findUserById');

      await service.createUser(dto);

      expect(service.findUserByUsername).toHaveBeenCalledWith(dto.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(unhashedPassword, 10);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(dto);
      expect(service.findUserById).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if username is taken', async () => {
      const dto: CreateUserDto = {
        username: 'username',
        password: 'password',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        mobile: 'mobile'
      };

      jest.spyOn(service, 'findUserByUsername').mockResolvedValue(new User());

      try {
        await service.createUser(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('findUserByUsername', () => {

    it('should find user by username', async () => {
      const username = 'username';

      await service.findUserByUsername(username);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ username });
    })

  })

  describe('findUserById', () => {

    it('should find user by id', async () => {
      const id = 'uuid';

      await service.findUserById(id);

      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    })

  })
});
