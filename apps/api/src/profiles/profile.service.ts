// apps/api/src/profiles/profile.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

type UpsertProfileInput = {
  firebaseUid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
};

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}

  async upsertFromFirebase(input: UpsertProfileInput) {
    const existing = await this.repo.findOne({
      where: { firebaseUid: input.firebaseUid },
    });

    const patch: Partial<Profile> = {
      email: input.email ?? null,
      displayName: input.displayName ?? null,
      photoURL: input.photoURL ?? null,
      phoneNumber: input.phoneNumber ?? null,
    };

    if (existing) {
      Object.assign(existing, patch);
      return this.repo.save(existing);
    }

    const created = this.repo.create({
      firebaseUid: input.firebaseUid,
      ...patch,
    });
    return this.repo.save(created);
  }
}
