import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OrganizationService } from '@repo/nest-organization-module';
import { User, UserService } from '@repo/nest-user-module';
import * as bcrypt from 'bcrypt';

import { CreateUserDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService
  ) {}

  async createUser(payload: CreateUserDTO): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(payload.password, salt);

    const user = await this.userService.findOneByEmail(payload.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    return this.userService.create({
      ...payload,
      salt,
      password: hashedPassword,
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async generateOrganizationToken(user: User): Promise<string> {
    const organization =
      await this.organizationService.getOrganizationCredentialsByUser(user);

    return this.organizationService.generateOrganizationToken(
      organization,
      user
    );
  }

  async generateToken(user: Partial<User>): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
