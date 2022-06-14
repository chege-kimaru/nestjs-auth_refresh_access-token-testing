import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class SharedEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        nullable: false
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)"
    })
    updatedAt: Date;
}