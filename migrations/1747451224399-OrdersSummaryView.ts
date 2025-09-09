import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdersSummaryView1747451224399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW read_orders_summary AS
      SELECT
        o.id AS "idPedido",
        COALESCE(c.cpf, 'CPF não fornecido') AS "cpfCliente",
        CASE
          WHEN o.status = 'pending' THEN 'Pagamento pendente'
          WHEN o.status = 'received' THEN 'Recebido'
          WHEN o.status = 'preparing' THEN 'Em preparação'
          WHEN o.status = 'ready' THEN 'Pronto'
          WHEN o.status = 'finished' THEN 'Finalizado'
          ELSE 'Desconhecido'
        END AS "status",
        
        o.created_at AS "criadoEm",
        o.updated_at AS "atualizadoEm",

        json_build_object(
          'codigoTransacao', COALESCE(o.transaction_code, ''),
          'dataPagamento', COALESCE(o.paid_at::text, ''),
          'totalPago', COALESCE(o.amount_paid, 0.0)
        ) AS "pagamento",

        json_agg(json_build_object(
          'idProduto', i.product_id,
          'nomeProduto', i.product_name,
          'descricaoProduto', i.product_description,
          'categoria', i.category_name,
          'precoUnitario', i.unit_price,
          'quantidade', i.quantity,
          'precoTotal', (i.unit_price * i.quantity)
        )) AS items

      FROM orders o
      LEFT JOIN customer c ON c.id = o.customer_id
      LEFT JOIN order_items i ON i.order_id = o.id
      GROUP BY
        o.id,
        c.cpf,
        o.status,
        o.amount_paid,
        o.paid_at,
        o.created_at,
        o.updated_at,
        o.transaction_code;

      CREATE UNIQUE INDEX idx_read_orders_summary_id ON read_orders_summary("idPedido");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS read_orders_summary;`);
  }
} 