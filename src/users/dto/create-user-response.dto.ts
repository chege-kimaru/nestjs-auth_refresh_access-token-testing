import { ApiProperty } from "@nestjs/swagger";

export class CreateUserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    mobile: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}