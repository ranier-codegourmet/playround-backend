export type UserOrganizationCredentials = {
  organization: {
    id: string;
    name: string;
    memberId: string;
    role: string;
    roleId: string;
  };
  user: {
    id: string;
    email: string;
  };
};
