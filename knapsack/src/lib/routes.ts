import { parse } from 'url';
import { BASE_PATHS } from './constants';
import { AppState } from '../client/store';

export function getTitleFromPath(path: string, appState: AppState): string {
  // clean up passed in path by removing querystrings
  const { pathname } = parse(path);
  // done cleaning

  const paths = pathname.split('/').filter(Boolean);
  const [
    /**
     * Base path for what type; `patterns`
     */
    basePath,
    /**
     * If base path is patterns, this would be patternId
     */
    firstParam,
    /**
     * If base path is patterns, this would be templateId
     */
    secondParam,
    ...restParams
  ] = paths;

  if (`/${basePath}` === BASE_PATHS.PATTERNS) return 'Patterns';

  // i.e. `/patterns/:patternId`
  if (`/${basePath}` === BASE_PATHS.PATTERN && !secondParam) {
    const pattern = appState.patternsState.patterns[firstParam];
    if (!pattern) {
      const allPatterns = Object.values(appState.patternsState.patterns);
      const availablePatternIds = allPatterns.map(p => p.id).join(', ');
      const msg = `The pattern "${firstParam}" was not found, these are the available ids: "${availablePatternIds}".`;
      console.error(msg);
      throw new Error(msg);
    }
    return pattern.title;
  }

  // i.e. `/patterns/:patternId/:templateId`
  if (pathname.startsWith(BASE_PATHS.PATTERN) && firstParam && secondParam) {
    const patternId = firstParam;
    const templateId = secondParam;
    const pattern = appState.patternsState.patterns[patternId];
    if (!pattern) {
      const allPatterns = Object.values(appState.patternsState.patterns);
      const availablePatternIds = allPatterns.map(p => p.id).join(', ');
      const msg = `The pattern "${patternId}" was not found, these are the available ids: "${availablePatternIds}".`;
      console.error(msg);
      throw new Error(msg);
    }

    const template = pattern.templates.find(t => t.id === templateId);
    if (!template) {
      const availableTemplateIds = pattern.templates.map(t => t.id).join(', ');
      const msg = `In the pattern "${patternId}", the template "${templateId}" was not found, these are the available ids: "${availableTemplateIds}".`;
      console.error(msg);
      throw new Error(msg);
    }

    console.log({ paths, title: template.title });
    return template.title;
  }
}

// some ideas

// type RouteInfo = {
//   url: string;
//   method: 'GET' | 'POST';
//   query?: object;
//   body?: object;
// };
//
// // type KnapsackPatternTemplate = import('../schemas/patterns').KnapsackPatternTemplate;
// export type getPatternRouteResult = KnapsackPattern;
//
// export function getPatternRoute({
//   patternId,
// }: {
//   patternId: string;
// }): RouteInfo {
//   return {
//     url: `${apiUrlBase}/pattern/${patternId}`,
//     method: 'GET',
//   };
// }
//
// const pattern = {
//   get: {
//     url: ({ patternId }: { patternId: string }) =>
//       `${apiUrlBase}/pattern/${patternId}`,
//     // resultType: KnapsackPattern
//   },
// };
