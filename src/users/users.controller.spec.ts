import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call service.createUser()', () => {
    const dto: CreateUserDto = {
      username: 'username',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      mobile: 'mobile',
    };
    controller.createUser(dto);
    expect(service.createUser).toHaveBeenCalledWith(dto);
  })
});
