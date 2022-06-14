import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Create new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ type: CreateUserResponseDto, status: 201 })
    @HttpCode(201)
    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }
}
