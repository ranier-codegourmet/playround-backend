import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User, UserService } from '@repo/nest-user-module';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserWithPasswordByEmail(email);

    if (!user) throw new UnauthorizedException('User does not exist');

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new UnauthorizedException('User does not exist');

    return user;
  }
}
