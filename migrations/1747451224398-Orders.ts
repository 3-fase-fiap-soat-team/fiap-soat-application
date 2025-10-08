import { MigrationInterface, QueryRunner } from "typeorm";

export class Orders1747451224398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "customer_id" uuid,
                "status" character varying NOT NULL,
                "transaction_code" character varying,
                "paid_at" TIMESTAMP WITH TIME ZONE,
                "amount_paid" decimal(10,2),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
                CONSTRAINT "FK_orders_customer" FOREIGN KEY ("customer_id") 
                    REFERENCES "customer"("id") ON DELETE SET NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "order_id" uuid NOT NULL,
                "product_id" uuid NOT NULL,
                "product_name" character varying NOT NULL,
                "product_description" text,
                "category_name" character varying NOT NULL,
                "unit_price" decimal(10,2) NOT NULL,
                "quantity" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
                CONSTRAINT "FK_order_items_order" FOREIGN KEY ("order_id") 
                    REFERENCES "orders"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_order_items_product" FOREIGN KEY ("product_id") 
                    REFERENCES "products"("id") ON DELETE RESTRICT
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
