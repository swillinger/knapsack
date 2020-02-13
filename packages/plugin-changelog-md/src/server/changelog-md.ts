import { KsServerPlugin } from '@knapsack/app/types';
import fs from 'fs-extra';
import path from 'path';
import { Content } from '../types';

export const configure = ({
  changelogPath,
}: {
  changelogPath: string;
}): KsServerPlugin<Content> => {
  const fullPath = path.isAbsolute(changelogPath)
    ? changelogPath
    : path.join(process.cwd(), changelogPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `The path to the changelog provided does not exist: ${fullPath}`,
    );
  }

  return {
    id: 'changelog-md',
    publicDir: path.join(__dirname, '../../dist'),
    clientPluginPath: 'client/index.js',
    // async init(brain) {},
    async loadContent() {
      return {
        changelogContent: await fs.readFile(fullPath, { encoding: 'utf-8' }),
      };
    },
  };
};
