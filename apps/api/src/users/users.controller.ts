// apps/api/src/users/users.controller.ts
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

type AuthedRequest = Request & { user: { uid: string; email?: string } };

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: AuthedRequest) {
    return this.usersService.findById(req.user.uid);
  }

  @Patch('me')
  async updateMe(@Req() req: AuthedRequest, @Body() body: any) {
    if ('role' in body) {
      throw new ForbiddenException('Role cannot be changed via this endpoint.');
    }
    if ('email' in body) {
      throw new ForbiddenException(
        'Email cannot be changed via this endpoint.',
      );
    }

    const dto: UpdateProfileDto = {
      name: body?.name,
      picture: body?.picture,
      phoneNumber: body?.phoneNumber,
    };
    return this.usersService.updateProfile(req.user.uid, dto);
  }

  // NEW: Admin-only list of users with pagination & search
  @Get()
  async listUsers(@Req() req: AuthedRequest, @Query() query: ListUsersDto) {
    const me = await this.usersService.findById(req.user.uid);
    if (!me || me.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admins only.');
    }
    return this.usersService.findAll(query);
  }
}
