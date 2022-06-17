import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Role } from "~/access-control/entities/role.entity";
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

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: "user_roles",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        }
    })
    roles: Role[];
}