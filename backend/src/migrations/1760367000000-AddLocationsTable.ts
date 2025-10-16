import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationsTable1760367000000 implements MigrationInterface {
    name = 'AddLocationsTable1760367000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "location" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "city" character varying NOT NULL,
                "state" character varying NOT NULL,
                "photo" character varying,
                "availableUnits" integer DEFAULT 0,
                "wifi" boolean DEFAULT false,
                "laundry" boolean DEFAULT false,
                CONSTRAINT "PK_location_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "location"`);
    }
}
