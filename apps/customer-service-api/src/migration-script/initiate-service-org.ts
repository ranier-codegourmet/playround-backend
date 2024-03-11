import { migrateTransaction, migrateUp } from '@repo/nest-mongo-database';
import {
  Organization,
  OrganizationMember,
  OrganizationMemberSchema,
  OrganizationMemberStatusEnum,
  OrganizationRole,
  OrganizationRoleSchema,
  OrganizationSchema,
  OrganizationTypeEnum,
  RoleEnum,
} from '@repo/nest-organization-module';
import { User, UserSchema } from '@repo/nest-user-module';
import * as bcrypt from 'bcrypt';

migrateUp(async (client) => {
  const organizationModel = client.model(Organization.name, OrganizationSchema);
  const organizationMemberModel = client.model(
    OrganizationMember.name,
    OrganizationMemberSchema,
  );
  const organizationRoleModel = client.model(
    OrganizationRole.name,
    OrganizationRoleSchema,
  );
  const userModel = client.model(User.name, UserSchema);

  await Promise.all([
    organizationModel.createCollection(),
    organizationMemberModel.createCollection(),
    organizationRoleModel.createCollection(),
    userModel.createCollection(),
  ]);

  await migrateTransaction(client, async (session) => {
    const organization = new organizationModel({
      name: 'Code Gourmet',
      type: OrganizationTypeEnum.SERVICE,
    });

    const savedOrganization = await organization.save({ session });

    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash('P@ssword123!', salt);

    const adminUser = new userModel({
      firstName: 'Code Gourmet',
      lastName: 'Admin',
      password: hashedPassword,
      email: 'admin@codegourmet.io',
      salt,
    });

    const savedAdminUser = await adminUser.save({ session });

    const csSalt: string = await bcrypt.genSalt(10);
    const csHashedPassword: string = await bcrypt.hash('P@ssword123!', salt);

    const csUser = new userModel({
      firstName: 'Code Gourmet',
      lastName: 'Support',
      password: csHashedPassword,
      email: 'support@codegourmet.io',
      salt: csSalt,
    });

    const savedCsUser = await csUser.save({ session });

    const adminMember = new organizationMemberModel({
      organization: savedOrganization._id,
      user: savedAdminUser._id,
      status: OrganizationMemberStatusEnum.ACCEPTED,
    });

    const savedAdminMember = await adminMember.save({ session });

    const csMember = new organizationMemberModel({
      organization: savedOrganization._id,
      user: savedCsUser._id,
      status: OrganizationMemberStatusEnum.ACCEPTED,
    });

    const savedCsMember = await csMember.save({ session });

    const adminRole = new organizationRoleModel({
      organizationMember: savedAdminMember._id,
      role: RoleEnum.OWNER,
    });

    await adminRole.save({ session });

    const csRole = new organizationRoleModel({
      organizationMember: savedCsMember._id,
      role: RoleEnum.MEMBER,
    });

    await csRole.save({ session });

    console.log('Service organization initiated');
  });

  process.exit(0);
});
