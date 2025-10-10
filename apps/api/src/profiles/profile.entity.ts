// apps/api/src/profiles/profile.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index('profiles_firebase_uid_uq', { unique: true })
  @Column({ type: 'varchar', length: 128 })
  firebaseUid!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName!: string | null;

  @Column({ type: 'varchar', length: 320, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  photoURL!: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: 'user' | 'admin';

  @Column({ type: 'boolean', default: false })
  isOnboarded!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
