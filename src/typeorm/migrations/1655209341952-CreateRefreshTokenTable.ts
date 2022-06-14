import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateRefreshTokenTable1655209341952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'refresh_tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isUnique: true,
                        generationStrategy: 'uuid',
                        default: `uuid_generate_v4()`
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'is_revoked',
                        type: 'boolean',
                        isNullable: false,
                        default: false
                    },
                    {
                        name: 'expiry',
                        type: 'timestamp',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: `CURRENT_TIMESTAMP`
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                        default: `CURRENT_TIMESTAMP`,
                        onUpdate: `CURRENT_TIMESTAMP`
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey('refresh_tokens',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('refresh_tokens', true);
    }

}
