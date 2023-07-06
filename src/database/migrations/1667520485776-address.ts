import { MigrationInterface, QueryRunner } from "typeorm";

export class address1667520485776 implements MigrationInterface {
    name = 'address1667520485776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "intNumber" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "intNumber" SET NOT NULL`);
    }

}
