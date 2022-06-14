import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    // TODO: Pipes are executed after guards hence transformation will happen after
    // LocalAuthGuard leaving no effect.
    // Currently, manually transforming to lowercase in AuthService.validate
    @Transform(param => param.value.toLowerCase())
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}