import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { SharedEntity } from "~/shared/entities/shared.entity";
import { User } from "~/users/entities/user.entity";

@Entity('refresh_tokens')
export class RefreshToken extends SharedEntity {
    @Column({ name: 'user_id', nullable: false })
    userId: string;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    expiry: Date;

    @Column({ name: 'is_revoked', nullable: false, default: false })
    isRevoked: boolean;
}