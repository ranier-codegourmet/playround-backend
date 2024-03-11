import { OrganizationMember } from '../organization-member/organization-member.schema';
import { OrganizationRole } from '../organization-role/organization-role.schema';
import { Organization } from './organization.schema';

export type CreateOrganization = {
  organization: Organization;
  organizationMember: OrganizationMember;
  organizationRole: OrganizationRole;
};

export enum OrganizationTypeEnum {
  STANDARD = 'STANDARD',
  SERVICE = 'SERVICE',
}
