import { Column, Entity, Table } from "typeorm";
import { SharedEntity } from "~/shared/entities/shared.entity";

@Entity('users')
export class User extends SharedEntity {

    @Column({ nullable: false, unique: true })
    username: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ name: 'first_name', nullable: false })
    firstName: string;

    @Column({ name: 'last_name', nullable: false })
    lastName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    mobile: string;
}