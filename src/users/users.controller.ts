import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Create new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ type: User, status: 201 })
    @HttpCode(201)
    @Post()
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(dto);
    }
}
