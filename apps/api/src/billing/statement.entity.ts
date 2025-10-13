// apps/api/src/billing/statement.entity.ts

import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StatementStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAID = 'paid',
  VOID = 'void',
  UNCOLLECTIBLE = 'uncollectible',
  REFUNDED = 'refunded',
}

@Entity('statements')
@Index(['user', 'status'])
export class Statement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (u) => u.statements, { onDelete: 'CASCADE' })
  user!: User;

  // Ties a statement to a subscription, if relevant
  @Column({ type: 'uuid', nullable: true })
  subscriptionId!: string | null;

  // Money
  @Column({ type: 'integer' })
  amount!: number; // in cents

  @Column({ type: 'char', length: 3, default: 'USD' })
  currency!: string;

  @Column({
    type: 'enum',
    enum: StatementStatus,
    default: StatementStatus.OPEN,
  })
  status!: StatementStatus;

  // Provider references (e.g., Stripe invoice/payment)
  @Column({ type: 'varchar', length: 128, nullable: true })
  provider!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 128, nullable: true })
  providerInvoiceId!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  hostedInvoiceUrl!: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  pdfUrl!: string | null;

  // Period covered by the statement
  @Column({ type: 'timestamptz', nullable: true })
  periodStart!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  periodEnd!: Date | null;

  // Dates
  @Column({ type: 'timestamptz', nullable: true })
  dueDate!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
