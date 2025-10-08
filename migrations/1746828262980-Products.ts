import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1746828262980 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE products (
                id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                category_id uuid NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT fk_category
                    FOREIGN KEY (category_id)
                    REFERENCES categories(id)
                    ON DELETE RESTRICT
            );
        `);

        // Inserindo produtos de exemplo
        await queryRunner.query(`
            INSERT INTO products (id, name, description, price, category_id, stock, created_at, updated_at) VALUES
            -- Lanches
            ('d79e7d79-c087-4597-8c02-304bbf83b407', 'X-Burger', 'Hambúrguer artesanal com queijo, alface, tomate e molho especial', 25.90, 'b477f4bc-373a-4e8a-ac71-11523b821a0e', 50, NOW(), NOW()),
            ('9d9419e1-aab3-4e70-bccb-9f92f7b89653', 'X-Bacon', 'Hambúrguer artesanal com queijo, bacon, alface, tomate e molho especial', 29.90, 'b477f4bc-373a-4e8a-ac71-11523b821a0e', 45, NOW(), NOW()),
            ('27f3ca24-b72f-4e9b-9404-f218a887c755', 'X-Salada', 'Hambúrguer artesanal com queijo, alface, tomate, cebola e molho especial', 27.90, 'b477f4bc-373a-4e8a-ac71-11523b821a0e', 40, NOW(), NOW()),
            
            -- Acompanhamentos
            ('5d93ee56-5cc8-4d86-b779-8eb6f29c186e', 'Batata Frita', 'Porção de batatas fritas crocantes', 15.90, '0a648c21-f468-47e1-98b4-10ce0d34da52', 100, NOW(), NOW()),
            ('996576cc-45d6-4918-9a2f-29988536c198', 'Onion Rings', 'Porção de anéis de cebola empanados', 18.90, '0a648c21-f468-47e1-98b4-10ce0d34da52', 80, NOW(), NOW()),
            
            -- Bebidas
            ('f79f4160-e6f0-4458-a287-bdf48b5b4b73', 'Refrigerante Lata', 'Refrigerante em lata 350ml', 6.90, 'dd971d31-e2c9-438e-8882-8e7b793be7d1', 200, NOW(), NOW()),
            ('bf317dc7-85ec-4d15-ab75-35c7be3437f8', 'Suco Natural', 'Suco natural de laranja 300ml', 8.90, 'dd971d31-e2c9-438e-8882-8e7b793be7d1', 100, NOW(), NOW()),
            
            -- Sobremesas
            ('5834382b-997a-4470-8def-ef8d28321c42', 'Milk Shake', 'Milk shake de chocolate com chantilly', 16.90, '1bb9953d-1f80-4888-b402-df7dde0c2581', 60, NOW(), NOW()),
            ('f333ca27-bb0d-4b7a-8364-daab5944cbdf', 'Sundae', 'Sorvete com calda de chocolate e chantilly', 14.90, '1bb9953d-1f80-4888-b402-df7dde0c2581', 70, NOW(), NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE products;`);
    }

}
