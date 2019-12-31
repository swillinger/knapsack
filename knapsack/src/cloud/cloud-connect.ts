import {
  KnapsackFile,
  KsCloudConfig,
  KsCloudSaveBody,
  KsFileSaver,
  PERMISSIONS,
} from '@knapsack/core/dist/cloud';
import { GenericResponse } from '@knapsack/core/dist/types';
import urlJoin from 'url-join';
import { isAbsolute, join, relative } from 'path';

export class KsCloudConnect {
  cloudConfig: KsCloudConfig;

  constructor(cloudConfig: KsCloudConfig) {
    this.cloudConfig = cloudConfig;
    // this.saveFilesToCloud = this.saveFilesToCloud.bind(this);
  }

  saveFilesToCloud: KsFileSaver = async ({
    files,
    title = 'New changes',
    message,
    user,
  }) => {
    if (!this.cloudConfig) {
      return {
        ok: false,
        message: 'No "cloud" in your "knapsack.config.js"',
      };
    }

    if (!user?.role?.permissions?.includes(PERMISSIONS.WRITE)) {
      return {
        ok: false,
        message: `Your user does not have write permission, sorry.`,
      };
    }

    const {
      // apiKey,
      apiBase,
      repoRoot,
      repoName,
      repoOwner,
      baseBranch = 'next',
    } = this.cloudConfig;

    const repo = `${repoOwner}/${repoName}`;
    // @todo re-enable repo access check. disabled b/c adding users to user involved manual api call.
    // if (!user.ksRepoAccess.includes(repo)) {
    //   return {
    //     ok: false,
    //     message: `Your user does not have permission to write to the "${repo}" repo, only these: ${user.ksRepoAccess?.join(
    //       ', ',
    //     )}`,
    //   };
    // }

    const body: KsCloudSaveBody = {
      owner: repoOwner,
      repo: repoName,
      baseBranch,
      title: `${title} from ${user.username}`,
      message,
      payload: {
        files: files.map(file => {
          return {
            ...file,
            path: relative(
              repoRoot,
              isAbsolute(file.path)
                ? file.path
                : join(process.cwd(), file.path),
            ),
          };
        }),
      },
    };
    // console.log('Sending save request to Knapsack Cloud...');
    // console.log('files paths:');
    // console.log(body.payload.files.map(file => file.path).join('\n'));
    const endpoint = urlJoin(apiBase, 'api/save');
    return fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // can't add auth just yet, cloud api uses it if present to attempt to authenticate as GitHub user (then falls back to GitHub app); this auth token is currently the AWS Cognito user.
        // Authorization: user.Authorization,
        // 'x-api-key': apiKey,
      },
    })
      .then(res => {
        const { ok, status, statusText } = res;
        // console.log({ ok, status, statusText });
        if (!ok) {
          const result: GenericResponse = {
            ok,
            message: `${status} - ${statusText}`,
          };
          return result;
        }
        return res.json();
      })
      .catch(e => {
        console.error('error saveFilesToCloud');
        console.error(e);
        const result: GenericResponse = {
          ok: false,
          message: `thrown error in saveFilesToCloud: ${e.message}`,
        };
        return result;
      });
  };
}
