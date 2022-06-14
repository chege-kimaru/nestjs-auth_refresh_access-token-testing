import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '~/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ type: LoginResponseDto, status: 200 })
    @Public()
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('login')
    login(@Request() req): Promise<LoginResponseDto> {
        return this.authService.login(req.user);
    }

    @ApiOperation({ summary: 'Refresh Token' })
    @ApiBody({ type: RefreshDto })
    @ApiResponse({ type: LoginResponseDto, status: 200 })
    @Public()
    @HttpCode(200)
    @Post('refresh')
    refresh(@Body() dto: RefreshDto): Promise<LoginResponseDto> {
        return this.authService.loginFromRefreshToken(dto.refreshToken);
    }

    @ApiOperation({ summary: 'Logout', description: 'This endpoint revokes the refresh token.' })
    @ApiBearerAuth()
    @ApiBody({ type: RefreshDto })
    @ApiResponse({ type: Object, status: 200 })
    @HttpCode(200)
    @Post('logout')
    logout(@Body() dto: RefreshDto): Promise<{}> {
        return this.authService.logout(dto.refreshToken);
    }

    @ApiOperation({ summary: 'Get User Profile' })
    @ApiBearerAuth()
    @ApiResponse({ type: User, status: 200 })
    @Get('profile')
    getProfile(@Request() req): User {
        return req.user;
    }
}
