// apps/api/src/profiles/profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { FirebaseUser } from '../auth/firebase-user.decorator';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

type FirebaseUserPayload = {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  phone_number?: string | null;
};

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profiles: ProfileService) {}

  // Returns current user's profile; creates/updates from Firebase on first hit
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@FirebaseUser() user: FirebaseUserPayload): Promise<Profile> {
    const profile = await this.profiles.upsertFromFirebase({
      firebaseUid: user.uid,
      email: user.email,
      displayName: user.name,
      photoURL: user.picture,
      phoneNumber: user.phone_number ?? null,
    });
    return profile;
  }
}
