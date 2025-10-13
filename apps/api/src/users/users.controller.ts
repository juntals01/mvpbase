import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/firebase/firebase-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
    // Block/ignore any attempt to change role or email via this route
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
}
