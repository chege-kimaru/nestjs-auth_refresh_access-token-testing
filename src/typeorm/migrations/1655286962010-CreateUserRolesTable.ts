import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm"

export class CreateUserRolesTable1655286962010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_roles',
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
                        name: 'role_id',
                        type: 'uuid',
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

        await queryRunner.createForeignKey('user_roles',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'RESTRICT',
                onUpdate: 'RESTRICT'
            })
        );

        await queryRunner.createForeignKey('user_roles',
            new TableForeignKey({
                columnNames: ['role_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'roles',
                onDelete: 'RESTRICT',
                onUpdate: 'RESTRICT'
            })
        );

        await queryRunner.createUniqueConstraint('user_roles',
            new TableUnique({
                columnNames: ['user_id', 'role_id']
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_roles', true);
    }

}
