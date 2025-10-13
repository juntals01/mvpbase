// apps/api/src/users/user.entity.ts

import { Statement } from 'src/billing/statement.entity';
import { Subscription } from 'src/billing/subscription.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  // Firebase UID as PK
  @PrimaryColumn({ type: 'varchar', length: 128 })
  id!: string;

  @Index({ unique: true, where: 'email IS NOT NULL' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name!: string | null;

  @Column({ type: 'text', nullable: true })
  picture!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phoneNumber!: string | null;

  // ---- Role (admin-only to change) ----
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  // ---- Timestamps ----
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  // ---- Relations to billing ----
  @OneToMany(() => Subscription, (s) => s.user)
  subscriptions!: Subscription[];

  @OneToMany(() => Statement, (st) => st.user)
  statements!: Statement[];
}
