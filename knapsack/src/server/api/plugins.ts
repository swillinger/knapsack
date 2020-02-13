import { Request, Response } from 'express';
import { getBrain } from '../../lib/bootstrap';
import {
  ACTIONS,
  ActionRequests,
  ActionResponses,
} from '../../schemas/api/plugins';

export async function handlePluginsEndpoint(req: Request, res: Response) {
  const reqBody: ActionRequests = req.body;
  const response: ActionResponses = {
    type: reqBody.type,
    ok: true,
    payload: {},
  };
  const plugins = getBrain()?.config?.plugins;
  if (!plugins) {
    response.message = `Plugins not loaded at all! Probably the server's fault.`;
    response.ok = false;
  }

  const plugin = plugins?.find(p => p.id === reqBody?.pluginId);

  if (!plugin) {
    response.message = `Plugin not found for id: "${reqBody.pluginId}"`;
    response.ok = false;
  }

  if (!response.ok) {
    return res.send(response);
  }
  switch (reqBody.type) {
    case ACTIONS.getContent: {
      response.payload = await plugin.loadContent();
      break;
    }
  }

  return res.send(response);
}
