// apps/api/src/billing/subscription.entity.ts

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

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  UNPAID = 'unpaid',
}

@Entity('subscriptions')
@Index(['user', 'status'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (u) => u.subscriptions, { onDelete: 'CASCADE' })
  user!: User;

  // Your plan identifiers (e.g., “basic”, “pro”, Stripe price id, etc.)
  @Column({ type: 'varchar', length: 128 })
  planId!: string;

  // If using Stripe or other PSP, keep foreign refs handy
  @Column({ type: 'varchar', length: 128, nullable: true })
  provider!: string | null; // 'stripe', 'paddle', etc.

  @Column({ type: 'varchar', length: 128, nullable: true })
  providerCustomerId!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 128, nullable: true })
  providerSubscriptionId!: string | null;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status!: SubscriptionStatus;

  // Period windows for access control
  @Column({ type: 'timestamptz', nullable: true })
  currentPeriodStart!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  currentPeriodEnd!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  cancelAt!: Date | null;

  @Column({ type: 'boolean', default: false })
  cancelAtPeriodEnd!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
