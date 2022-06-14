import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '~/users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {

    // TODO: Good Practice Discussion, would you rather inject the UsersService from UsersModule instead of injecting the Users Repository?
    // TODO cont. Preferred to prevent circular dependency between UsersModule and AuthModule
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
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

    async login(user: User): Promise<LoginResponseDto> {
        const payload = { username: user.username, sub: user.id };
        return {
            user,
            payload: {
                type: 'bearer',
                access_token: await this.jwtService.signAsync(payload),
                refresh_token: null
            }
        };
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
