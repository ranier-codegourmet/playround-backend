import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrganizationMember,
  OrganizationMemberRepository,
  OrganizationMemberSchema,
  OrganizationMemberService,
} from '@repo/nest-organization-module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrganizationMember.name, schema: OrganizationMemberSchema },
    ]),
  ],
  providers: [OrganizationMemberService, OrganizationMemberRepository],
  exports: [OrganizationMemberService],
})
export class OrganizationMemberModule {}
