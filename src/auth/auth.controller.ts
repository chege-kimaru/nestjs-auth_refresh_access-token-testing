import { Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '~/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ type: LoginResponseDto, status: 200 })
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('login')
    login(@Request() req): Promise<LoginResponseDto> {
        return this.authService.login(req.user);
    }

    @ApiOperation({ summary: 'Get User Profile' })
    @ApiBearerAuth()
    @ApiResponse({ type: User, status: 200 })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req): User {
        return req.user;
    }
}
