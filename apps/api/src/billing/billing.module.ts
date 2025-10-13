// apps/api/src/billing/billing.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statement } from './statement.entity';
import { Subscription } from './subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Statement])],
  exports: [TypeOrmModule],
})
export class BillingModule {}
