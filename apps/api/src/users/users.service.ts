import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

type UpsertFromFirebase = {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  phone_number: string | null;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async upsertFromFirebase(payload: UpsertFromFirebase) {
    const existing = await this.findById(payload.uid);
    const now = new Date();

    if (existing) {
      existing.email = payload.email;
      existing.name = payload.name;
      existing.picture = payload.picture;
      existing.phoneNumber = payload.phone_number;
      existing.lastLoginAt = now;
      return this.repo.save(existing);
    }

    const user = this.repo.create({
      id: payload.uid,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      phoneNumber: payload.phone_number,
      lastLoginAt: now,
    });
    return this.repo.save(user);
  }
}
