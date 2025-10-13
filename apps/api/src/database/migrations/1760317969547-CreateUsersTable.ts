import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1760317969547 implements MigrationInterface {
    name = 'CreateUsersTable1760317969547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying(128) NOT NULL, "email" character varying(255), "name" character varying(255), "picture" text, "phoneNumber" character varying(64), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastLoginAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_65cbf5fcb331619593ee334c7c" ON "users" ("email") WHERE email IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_65cbf5fcb331619593ee334c7c"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
