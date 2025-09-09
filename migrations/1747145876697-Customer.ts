import { MigrationInterface, QueryRunner } from 'typeorm';

export class Customer1747145876697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE customer (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255),
            cpf CHAR(11) UNIQUE,
            email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);

    await queryRunner.query(`
            INSERT INTO customer (id, name, cpf, email) VALUES
            ('3f69217b-d5a0-4dd3-9005-719277ea325b', 'John Doe', '12345678901', 'john.doe@example.com'),
            ('56942f40-4dc0-4c46-a012-557c189eaf17', 'Jane Doe', '12345678902', 'jane.doe@example.com'),
            ('7d232d5f-3bba-43b6-af02-db0100e4fe1f', 'Jim Doe', '12345678903', 'jim.doe@example.com');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE customer;`);
  }
}
