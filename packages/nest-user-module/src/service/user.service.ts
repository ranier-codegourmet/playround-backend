import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '../repository/user.repository';
import { User } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: Partial<User>): Promise<User> {
    const duplicateUser = await this.findOneByEmail(user.email);

    if (duplicateUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.userRepository.findOneAndUpdate({ email: user.email }, user, {
      projection: { __v: 0, salt: 0, password: 0 },
    });
  }

  async updateById(id: string, user: Partial<User>): Promise<User> {
    return this.userRepository.findOneAndUpdate({ _id: id }, user, {
      projection: { __v: 0, salt: 0, password: 0 },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne(
      { email },
      { __v: 0, salt: 0, password: 0 }
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id, { __v: 0, salt: 0, password: 0 });
  }

  async getUserWithPasswordByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email }, { __v: 0, salt: 0 });
  }
}
