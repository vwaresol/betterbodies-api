import { MigrationInterface, QueryRunner } from "typeorm";

export class userProfile1667509758491 implements MigrationInterface {
    name = 'userProfile1667509758491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userProfileId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_2ffc8d3455097079866bfca4d47" UNIQUE ("userProfileId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2ffc8d3455097079866bfca4d47" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2ffc8d3455097079866bfca4d47"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_2ffc8d3455097079866bfca4d47"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userProfileId"`);
    }

}
