import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '~/users/entities/user.entity';
import * as ms from 'ms';
import { TokenExpiredError } from 'jsonwebtoken';
import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenPayload {
    jti: string;
    sub: string
}

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }

    async generateRefreshToken(user: User): Promise<string> {
        const expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + ms(expiresIn));

        const token = await this.refreshTokenRepository.save({
            userId: user.id,
            expiry
        });

        return this.jwtService.signAsync({}, {
            expiresIn,
            subject: user.id,
            jwtid: token.id
        });
    }

    // TODO: Minimize number of DB calls. Currently at 2 ie getTokenFromDb() and getUserFromDb()
    // Since token has a refrence to userId which is all we need to generate access token,
    // can we omit the getUserFromDbCall()?
    async resolveRefreshToken(encoded: string): Promise<{ user: User, token: RefreshToken }> {
        const payload = await this.decodeRefreshToken(encoded);
        const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

        if (!token) {
            throw new UnprocessableEntityException('Refresh token not found');
        }

        if (token.isRevoked) {
            throw new UnprocessableEntityException('Refresh token revoked');
        }

        const user = await this.getUserFromRefreshTokenPayload(payload);

        if (!user) {
            throw new UnprocessableEntityException('Refresh token malformed');
        }

        return { user, token }
    }

    async revokeRefreshToken(refreshToken: string): Promise<void> {
        const { token } = await this.resolveRefreshToken(refreshToken);
        await this.refreshTokenRepository.update(token.id, { isRevoked: true });
    }

    private async getUserFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<User> {
        const subId = payload.sub;

        if (!subId) {
            throw new UnprocessableEntityException('Refresh token malformed');
        }

        return this.userRepository.findOneBy({ id: subId });
    }

    private async getStoredTokenFromRefreshTokenPayload(payload: RefreshTokenPayload): Promise<RefreshToken | null> {
        const tokenId = payload.jti

        if (!tokenId) {
            throw new UnprocessableEntityException('Refresh token malformed');
        }

        return this.refreshTokenRepository.findOneBy({ id: tokenId });
    }

    private async decodeRefreshToken(token: string): Promise<RefreshTokenPayload> {
        try {
            return this.jwtService.verifyAsync(token);
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnprocessableEntityException('Refresh token expired')
            } else {
                throw new UnprocessableEntityException('Refresh token malformed')
            }
        }
    }

}
