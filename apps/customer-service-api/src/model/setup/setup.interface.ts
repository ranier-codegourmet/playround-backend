import { CreateOrganization } from '@repo/nest-organization-module';
import { User } from '@repo/nest-user-module';

export type SetupOrganizationResponse = {
  organization: CreateOrganization;
  user: User;
};
