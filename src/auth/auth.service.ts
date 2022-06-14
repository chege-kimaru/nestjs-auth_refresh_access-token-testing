import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '~/users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {

    // TODO: Good Practice Discussion, would you rather inject the UsersService from UsersModule instead of injecting the Users Repository?
    // TODO cont. Preferred to prevent circular dependency between UsersModule and AuthModule
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService
    ) { }

    async validateUser(username: string, password: string): Promise<User | null> {
        // A pipe transformer won't work since LocalAuthGurd will be called before the pipe
        // so just transform to lowercase here.
        username = username.toLowerCase();
        let user = await this.findUserByCredentials(username);

        if (user && await compare(password, user.password)) {
            return this.findUserById(user.id);
        }

        return null;
    }

    async login(user: User, refreshToken?: string): Promise<LoginResponseDto> {
        return {
            user,
            payload: {
                type: 'bearer',
                access_token: await this.jwtService.signAsync({ sub: user.id }),
                refresh_token: refreshToken ? refreshToken : (await this.refreshTokenService.generateRefreshToken(user))
            }
        };
    }

    async loginFromRefreshToken(refreshToken: string): Promise<LoginResponseDto> {
        try {
            const { user, token } = await this.refreshTokenService.resolveRefreshToken(refreshToken);
            return this.login(user, refreshToken);
        } catch (e) {
            throw new ForbiddenException(e.message);
        }
    }

    async logout(refreshToken): Promise<{}> {
        await this.refreshTokenService.revokeRefreshToken(refreshToken);
        return {};
    }

    findUserById(userId: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id: userId });
    }

    findUserByCredentials(username: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { username },
            select: ['username', 'password']
        });
    }
}
