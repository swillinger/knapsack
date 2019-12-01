import { Auth } from 'aws-amplify';
import {
  KsUserRole,
  KS_USER_ROLES,
  PERMISSIONS,
  KsUserRoleId,
  ksRolesOrdered,
} from '@knapsack/core/dist/cloud';

export type User = {
  username: string;
  id: string;
  attributes: {
    email: string;
    'custom:ks-github-repos'?: string;
    sub?: string;
  };
};

export async function getUserInfo(): Promise<{
  role?: KsUserRole;
  canEdit?: boolean;
  user?: User;
  username?: string;
  ksRepoAccess?: string[];
  token?: string;
}> {
  let groups: KsUserRoleId[] = [];
  let ksRepoAccess: string[] = [];
  let canEdit = false;
  let username;
  const user: User = await Auth.currentUserInfo();
  if (user) {
    const authedUser = await Auth.currentAuthenticatedUser();
    username = authedUser.getUsername();
    const {
      'cognito:groups': cognitoGroups,
      'cognito:roles': cognitoArnRoles,
      'cognito:preferred_role': cognitoArnPreferredRole,
      'custom:ks-github-repos': ksGithubRepos,
    } = authedUser.signInUserSession.getIdToken().payload;

    // console.log({
    //   authedUser,
    //   cognitoGroups,
    //   cognitoArnRoles,
    //   cognitoArnPreferredRole,
    //   ksGithubRepos,
    // });
    groups = cognitoGroups;
    ksRepoAccess = ksGithubRepos.split(',');
  }
  const role =
    groups.length === 0
      ? KS_USER_ROLES.anonymous
      : ksRolesOrdered.find(r => groups.includes(r.id));

  canEdit = role.permissions.includes(PERMISSIONS.WRITE);
  let token;
  try {
    // token = getClientToken();
    const session = await Auth.currentSession();
    token = session?.getAccessToken()?.getJwtToken();
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return {
    user,
    username,
    canEdit,
    role,
    ksRepoAccess,
    token,
  };
}
