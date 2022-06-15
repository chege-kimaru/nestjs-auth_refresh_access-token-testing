import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { SharedEntity } from "~/shared/entities/shared.entity";
import { User } from "~/users/entities/user.entity";
import { Role } from "./role.entity";

@Entity('user_roles')
@Index(["userId", "roleId"], { unique: true })
export class UserRole extends SharedEntity {

    @Column({ nullable: false, name: 'user_id' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false, name: 'role_id' })
    roleId: string;

    @ManyToOne(() => Role)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // [unique] userId + roleId
}