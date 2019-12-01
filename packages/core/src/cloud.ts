import { GenericResponse } from '@knapsack/core/src/types/misc';

export interface KnapsackFile {
  contents: string;
  path: string;
  encoding: 'utf-8' | 'base64';
}

export type KsUserInfo = {
  username?: string;
  role: KsUserRole;
  Authorization: string;
  ksRepoAccess: string[];
};

export type KsUserRoleId =
  | 'admins'
  | 'editors'
  | 'contributors'
  | 'viewers'
  | 'anonymous';

export interface KsUserRole {
  id: KsUserRoleId;
  permissions: string[];
}

export type KsFileSaver = (opt: {
  files: KnapsackFile[];
  title?: string;
  message?: string;
  user: KsUserInfo;
}) => Promise<GenericResponse>;

export interface KsCloudConfig {
  apiBase: string;
  // apiKey: string;
  repoName: string;
  repoOwner: string;
  repoRoot: string;
  baseBranch?: string;
}

export interface KsCloudSaveBody {
  owner: string;
  repo: string;
  baseBranch: string;
  title: string;
  message?: string;
  payload: {
    files: KnapsackFile[];
  };
}

export const KS_USER_ROLE_IDS: Record<KsUserRoleId, KsUserRoleId> = {
  admins: 'admins',
  editors: 'editors',
  contributors: 'contributors',
  viewers: 'viewers',
  anonymous: 'anonymous',
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
};

export const KS_USER_ROLES: Record<KsUserRoleId, KsUserRole> = {
  admins: {
    id: KS_USER_ROLE_IDS.admins,
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  },
  editors: {
    id: KS_USER_ROLE_IDS.editors,
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  },
  contributors: {
    id: KS_USER_ROLE_IDS.contributors,
    permissions: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  },
  viewers: {
    id: KS_USER_ROLE_IDS.viewers,
    permissions: [PERMISSIONS.READ],
  },
  anonymous: {
    id: KS_USER_ROLE_IDS.anonymous,
    permissions: [PERMISSIONS.READ],
  },
};

// in order of precedence, first one found is your "role". earlier = more permissions
export const ksRolesOrdered = [
  KS_USER_ROLES.admins,
  KS_USER_ROLES.editors,
  KS_USER_ROLES.contributors,
  KS_USER_ROLES.viewers,
  KS_USER_ROLES.anonymous,
];
