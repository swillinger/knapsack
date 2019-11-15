import { compile } from 'ejs';
import { join } from 'path';
import { readFileSync } from 'fs';

const renderTwigUsageTemplate = compile(
  readFileSync(join(__dirname, 'template.twig.ejs'), 'utf8'),
  {
    filename: 'template.twig.ejs',
    async: true,
  },
);

export async function getTwigUsage(data: {
  templateName: string;
  props: object;
  extraProps?: {
    key: string;
    value: string;
  }[];
  before?: string;
  after?: string;
}): Promise<string> {
  const props = Object.keys(data.props).map(key => {
    const value = JSON.stringify(data.props[key]);
    return {
      key,
      value,
    };
  });
  const { templateName, before, after } = data;
  const result = await renderTwigUsageTemplate({
    templateName,
    props: data.extraProps ? [...props, ...data.extraProps] : props,
    before,
    after,
  });
  return result;
}
