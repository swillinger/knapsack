import { apiUrlBase } from './constants';
import { GenericResponse } from '../schemas/misc';
import { KnapsackPattern } from '../schemas/patterns';

type RouteInfo = {
  url: string;
  method: 'GET' | 'POST';
  query?: object;
  body?: object;
  resultType?: any;
};

// type KnapsackPatternTemplate = import('../schemas/patterns').KnapsackPatternTemplate;
export type getPatternRouteResult = KnapsackPattern;

export function getPatternRoute({
  patternId,
}: {
  patternId: string;
}): RouteInfo {
  let resultType: KnapsackPattern;
  return {
    url: `${apiUrlBase}/pattern/${patternId}`,
    method: 'GET',
    resultType,
  };
}

const pattern = {
  get: {
    url: ({ patternId }: { patternId: string }) =>
      `${apiUrlBase}/pattern/${patternId}`,
    // resultType: KnapsackPattern
  },
};

export type setPatternTemplateReadmeRouteResult = GenericResponse;

export function setPatternTemplateReadmeRoute({
  patternId,
  templateId,
  readme,
}: {
  patternId: string;
  templateId: string;
  readme?: string;
}): RouteInfo {
  return {
    url: `${apiUrlBase}/pattern/${patternId}/${templateId}/readme`,
    method: 'POST',
    body: {
      readme,
    },
  };
}
