import { MigrationInterface, QueryRunner } from "typeorm";

export class pendingTable1677110431458 implements MigrationInterface {
    name = 'pendingTable1677110431458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_914c56465eb2bdf14c13352c463"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentmethod_enum" AS ENUM('PAYPAL', 'AUTORIZENET')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "referenceId" character varying NOT NULL, "status" character varying NOT NULL, "textCode" character varying, "paymentMethod" "public"."payment_paymentmethod_enum" NOT NULL DEFAULT 'AUTORIZENET', "orderId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "nodeId"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "parentId" character varying`);
        await queryRunner.query(`ALTER TABLE "photo" ADD "productId" uuid`);
        await queryRunner.query(`ALTER TABLE "category" ADD "nodeId" integer NOT NULL`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_914c56465eb2bdf14c13352c463" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
