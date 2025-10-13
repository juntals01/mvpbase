import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';
import { FirebaseUser } from './firebase/firebase-user.decorator';
import { FirebaseUserDto } from './firebase/firebase-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@FirebaseUser() firebase: FirebaseUserDto) {
    const user = await this.users.upsertFromFirebase(firebase);
    return user;
  }
}
