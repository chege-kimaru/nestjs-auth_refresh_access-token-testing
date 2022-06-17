import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { SharedEntity } from "~/shared/entities/shared.entity";
import { User } from "~/users/entities/user.entity";

@Entity("roles")
export class Role extends SharedEntity {
    @ApiProperty()
    @Column({ nullable: false })
    name: string;

    @ManyToMany(() => User, user => user.roles)
    @JoinTable({
        name: "user_roles",
        joinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        }
    })
    users: User[];
}