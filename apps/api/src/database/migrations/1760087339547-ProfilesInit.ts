import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfilesInit1760087339547 implements MigrationInterface {
    name = 'ProfilesInit1760087339547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firebaseUid" character varying(128) NOT NULL, "displayName" character varying(255), "email" character varying(320), "photoURL" character varying(1024), "phoneNumber" character varying(32), "role" character varying(20) NOT NULL DEFAULT 'user', "isOnboarded" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "profiles_firebase_uid_uq" ON "profiles" ("firebaseUid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."profiles_firebase_uid_uq"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
