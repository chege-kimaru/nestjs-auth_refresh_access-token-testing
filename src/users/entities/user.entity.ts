import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, Table } from "typeorm";
import { SharedEntity } from "~/shared/entities/shared.entity";

@Entity('users')
export class User extends SharedEntity {

    @ApiProperty()
    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @ApiProperty()
    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @ApiProperty()
    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @ApiProperty()
    @Column({ nullable: false })
    email: string;

    @ApiProperty()
    @Column({ nullable: false })
    mobile: string;
}