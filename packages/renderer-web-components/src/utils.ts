import { compile } from 'ejs';
import { join } from 'path';
import { readFileSync } from 'fs';

const renderUsageTemplate = compile(
  readFileSync(join(__dirname, 'template.web-components.ejs'), 'utf8'),
  {
    filename: 'template.web-components.ejs',
    async: true,
  },
);

export async function getUsage(data: {
  templateName: string;
  props?: object;
  children?: string;
  before?: string;
  after?: string;
}): Promise<string> {
  const props = Object.keys(data.props || {}).map(key => {
    const value = data.props[key];
    return {
      key,
      value,
    };
  });
  const attributes = props
    .map(({ key, value }) => {
      switch (typeof value) {
        case 'string':
          return `${key}="${value}"`;
        case 'boolean':
          return value ? `${key}` : '';
        default:
          return `${key}="${JSON.stringify(value)}"`;
      }
    })
    .filter(Boolean)
    .join(' ');
  const { templateName, children, before, after } = data;
  const result = await renderUsageTemplate({
    templateName,
    attributes,
    props,
    children,
    before,
    after,
  });
  return result.trim();
}
