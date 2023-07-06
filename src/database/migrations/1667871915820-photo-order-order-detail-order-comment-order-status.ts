import { MigrationInterface, QueryRunner } from "typeorm";

export class photoOrderOrderDetailOrderCommentOrderStatus1667871915820 implements MigrationInterface {
    name = 'photoOrderOrderDetailOrderCommentOrderStatus1667871915820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "note" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, "userId" uuid, CONSTRAINT "PK_1bf9403b945229123a8493ad45c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_status_enum" AS ENUM('Created', 'On Process', 'On Transit', 'Delivered', 'Canceled')`);
        await queryRunner.query(`CREATE TABLE "order_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."order_status_status_enum" NOT NULL DEFAULT 'Created', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ea75b2a26f83f3bc98b9c6aaf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderNumber" BIGSERIAL NOT NULL, "total" numeric(10,2) NOT NULL, "shipping" numeric(10,2) NOT NULL, "picked" boolean NOT NULL DEFAULT false, "statusId" uuid, "addressId" uuid, "userId" uuid, "deliveryUserId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "price" numeric(10,2) NOT NULL, "salePrice" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "orderId" uuid, "productId" uuid, CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "main" boolean NOT NULL DEFAULT true, "productId" uuid, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "nodeId" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "category_nodeId_seq"`);
        await queryRunner.query(`ALTER TABLE "order_comment" ADD CONSTRAINT "FK_81bc388abc6f9fa900da81fdabb" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_comment" ADD CONSTRAINT "FK_7a1fe6eee61e5cc2682c77dcb68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_3b6667bfe775fa39753ca6af2dc" FOREIGN KEY ("statusId") REFERENCES "order_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_73f9a47e41912876446d047d015" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_7eeba87ab436612e0250bdbceec" FOREIGN KEY ("deliveryUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_detail" ADD CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_914c56465eb2bdf14c13352c463" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_914c56465eb2bdf14c13352c463"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_a3647bd11aed3cf968c9ce9b835"`);
        await queryRunner.query(`ALTER TABLE "order_detail" DROP CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_7eeba87ab436612e0250bdbceec"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_73f9a47e41912876446d047d015"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_3b6667bfe775fa39753ca6af2dc"`);
        await queryRunner.query(`ALTER TABLE "order_comment" DROP CONSTRAINT "FK_7a1fe6eee61e5cc2682c77dcb68"`);
        await queryRunner.query(`ALTER TABLE "order_comment" DROP CONSTRAINT "FK_81bc388abc6f9fa900da81fdabb"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "category_nodeId_seq" OWNED BY "category"."nodeId"`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "nodeId" SET DEFAULT nextval('"category_nodeId_seq"')`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TABLE "order_detail"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "order_status"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_comment"`);
    }

}
