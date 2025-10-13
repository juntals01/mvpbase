import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BillingModule } from './billing/billing.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, BillingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
