import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@repo/nest-user-module';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import {
  Organization,
  OrganizationDocument,
} from '../../src/model/organization/organization.schema';
import { OrganizationMemberStatusEnum } from '../../src/model/organization-member/organization-member.interface';
import {
  OrganizationMember,
  OrganizationMemberDocument,
} from '../../src/model/organization-member/organization-member.schema';
import { RoleEnum } from '../../src/model/organization-role/organization-role.interface';
import {
  OrganizationRole,
  OrganizationRoleDocument,
} from '../../src/model/organization-role/organization-role.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(OrganizationMember.name)
    private organizationMemberModel: Model<OrganizationMemberDocument>,
    @InjectModel(OrganizationRole.name)
    private organizationRoleModel: Model<OrganizationRoleDocument>,
  ) {}

  public async createUser(payload: Partial<User>): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      salt,
    });

    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  public async setupOrganization(
    payload: Partial<Organization>,
    user: User,
  ): Promise<{
    organization: Organization;
    member: OrganizationMember;
    role: OrganizationRole;
  }> {
    const organization = await this.organizationModel.create(payload);
    const member = await this.organizationMemberModel.create({
      organization: organization._id,
      user: user._id,
      status: OrganizationMemberStatusEnum.ACCEPTED,
    });
    const role = await this.organizationRoleModel.create({
      organizationMember: member._id,
      role: RoleEnum.OWNER,
    });

    return { organization, member, role };
  }

  public async getOrganizationMemberByUser(
    user: User,
  ): Promise<OrganizationMember> {
    return this.organizationMemberModel.findOne({ user }).lean();
  }

  public async getOrganizationRoleByMember(
    member: OrganizationMember,
  ): Promise<OrganizationRole> {
    return this.organizationRoleModel
      .findOne({ organizationMember: member })
      .lean();
  }

  public async getOrganizationByMember(
    member: OrganizationMember,
  ): Promise<Organization> {
    return this.organizationModel.findOne({ _id: member.organization }).lean();
  }

  public async clearDatabase(): Promise<void> {
    await this.userModel.deleteMany({});
    await this.organizationModel.deleteMany({});
    await this.organizationMemberModel.deleteMany({});
    await this.organizationRoleModel.deleteMany({});
  }
}
