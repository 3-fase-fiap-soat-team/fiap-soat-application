import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderItemEntity } from '../entities/order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string | null;

  @Column()
  status: string;

  @Column({ name: 'transaction_code', nullable: true })
  transactionCode: string;

  @Column({ name: 'paid_at', type: 'timestamp with time zone', nullable: true })
  paidAt: Date | null;

  @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid: number | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
} 