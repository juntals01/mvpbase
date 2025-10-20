// apps/api/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async upsertFromFirebase(payload: UpsertFromFirebase) {
    const now = new Date();
    const email = payload.email?.trim().toLowerCase() ?? null;

    const existing = await this.findById(payload.uid);
    if (existing) {
      existing.email = email;
      existing.name = payload.name ?? null;
      existing.picture = payload.picture ?? null;
      existing.phoneNumber = payload.phone_number ?? null;
      existing.lastLoginAt = now;
      return this.repo.save(existing);
    }

    const user = this.repo.create({
      id: payload.uid,
      email,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
      phoneNumber: payload.phone_number ?? null,
      lastLoginAt: now,
    });
    return this.repo.save(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const toUpdate: Partial<User> = {
      name: dto.name ?? null,
      picture: dto.picture ?? null,
      phoneNumber: dto.phoneNumber ?? null,
    };

    // save() merges by PK and returns the updated entity
    await this.repo.save({ id: userId, ...toUpdate });
    return this.findById(userId);
  }

  async findAll(params: ListUsersDto) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(Math.max(1, params.limit ?? 20), 100);
    const skip = (page - 1) * limit;

    const q = params.q?.trim();
    const where = q
      ? [{ name: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }]
      : undefined;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' }, // ← use your actual @CreateDateColumn name
      skip,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }
}
