import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBillingAndUserRole1760339856066 implements MigrationInterface {
    name = 'AddBillingAndUserRole1760339856066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."statements_status_enum" AS ENUM('draft', 'open', 'paid', 'void', 'uncollectible', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscriptionId" uuid, "amount" integer NOT NULL, "currency" character(3) NOT NULL DEFAULT 'USD', "status" "public"."statements_status_enum" NOT NULL DEFAULT 'open', "provider" character varying(128), "providerInvoiceId" character varying(128), "hostedInvoiceUrl" character varying(512), "pdfUrl" character varying(512), "periodStart" TIMESTAMP WITH TIME ZONE, "periodEnd" TIMESTAMP WITH TIME ZONE, "dueDate" TIMESTAMP WITH TIME ZONE, "paidAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" character varying(128), CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e6e4ce58811c1a871166d4d83e" ON "statements" ("providerInvoiceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3a5c08c3811589b6907a526bc1" ON "statements" ("userId", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "planId" character varying(128) NOT NULL, "provider" character varying(128), "providerCustomerId" character varying(128), "providerSubscriptionId" character varying(128), "status" "public"."subscriptions_status_enum" NOT NULL, "currentPeriodStart" TIMESTAMP WITH TIME ZONE, "currentPeriodEnd" TIMESTAMP WITH TIME ZONE, "cancelAt" TIMESTAMP WITH TIME ZONE, "cancelAtPeriodEnd" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" character varying(128), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2eeb6283285e7ffc0afed6606a" ON "subscriptions" ("providerSubscriptionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2a37d226c4f58242548e53c6b" ON "subscriptions" ("userId", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_9eb6244a1bc05e6e8937e1f7e91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`);
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_9eb6244a1bc05e6e8937e1f7e91"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2a37d226c4f58242548e53c6b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2eeb6283285e7ffc0afed6606a"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a5c08c3811589b6907a526bc1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6e4ce58811c1a871166d4d83e"`);
        await queryRunner.query(`DROP TABLE "statements"`);
        await queryRunner.query(`DROP TYPE "public"."statements_status_enum"`);
    }

}
