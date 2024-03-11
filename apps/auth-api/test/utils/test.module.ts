import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@repo/nest-user-module';

import {
  Organization,
  OrganizationSchema,
} from '../../src/model/organization/organization.schema';
import {
  OrganizationMember,
  OrganizationMemberSchema,
} from '../../src/model/organization-member/organization-member.schema';
import {
  OrganizationRole,
  OrganizationRoleSchema,
} from '../../src/model/organization-role/organization-role.schema';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: OrganizationMember.name, schema: OrganizationMemberSchema },
      { name: OrganizationRole.name, schema: OrganizationRoleSchema },
    ]),
  ],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
