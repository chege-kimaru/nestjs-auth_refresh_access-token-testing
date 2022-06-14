import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) { }

    // TODO: Verify mobile
    // TODO: Verify email
    // TODO: Should email and/or phone be unique?
    async createUser(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.findUserByUsername(dto.username);
        if (existingUser) {
            throw new ForbiddenException('This username is already in use');
        }

        dto.password = await hash(dto.password, saltOrRounds);
        const saveResult = await this.userRepository.save(dto);
        return this.findUserById(saveResult.id);
    }

    findUserById(userId: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id: userId });
    }

    findUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }
}
