import { ApiProperty } from "@nestjs/swagger";
import { User } from "~/users/entities/user.entity";

export class LoginPayloadDto {
    @ApiProperty()
    type: string

    @ApiProperty()
    access_token: string

    @ApiProperty()
    refresh_token?: string
}

export class LoginResponseDto {
    @ApiProperty()
    user: User;

    @ApiProperty()
    payload: LoginPayloadDto;
}