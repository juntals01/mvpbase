import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
