import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProductForeignKeyToCascade1748574145136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            DROP CONSTRAINT "FK_order_items_product"
        `);

        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ADD CONSTRAINT "FK_order_items_product" 
            FOREIGN KEY ("product_id") 
            REFERENCES "products"("id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_items" 
            DROP CONSTRAINT "FK_order_items_product"
        `);

        await queryRunner.query(`
            ALTER TABLE "order_items" 
            ADD CONSTRAINT "FK_order_items_product" 
            FOREIGN KEY ("product_id") 
            REFERENCES "products"("id") 
            ON DELETE RESTRICT
        `);
    }

}
