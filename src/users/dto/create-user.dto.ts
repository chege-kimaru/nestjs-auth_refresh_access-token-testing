import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    // TODO: username security
    @ApiProperty()
    @Transform(param => param.value.toLowerCase())
    @IsNotEmpty()
    username: string;

    // TODO: password security
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @Transform(param => param.value.toLowerCase())
    @IsEmail()
    @IsNotEmpty()
    email: string;

    // TODO: validate mobile
    @ApiProperty()
    @IsNotEmpty()
    mobile: string;
}