import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrganizationRole,
  OrganizationRoleRepository,
  OrganizationRoleSchema,
  OrganizationRoleService,
} from '@repo/nest-organization-module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrganizationRole.name, schema: OrganizationRoleSchema },
    ]),
  ],
  providers: [OrganizationRoleService, OrganizationRoleRepository],
  exports: [OrganizationRoleService],
})
export class OrganizationRoleModule {}
