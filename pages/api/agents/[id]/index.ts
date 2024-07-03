import { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';
import { buffer } from 'micro';
import axios from 'axios';

const db = new DB();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const agent = await db.getAgentById(id as string);
  if (!agent) return res.status(404).end();

  const url = agent.url;
  const buf = await buffer(req);

  // Forward the request to the agent.
  const response = await axios({
    method: req.method,
    url,
    headers: req.headers,
    data: buf,
  });

  return res.status(response.status).send(response.data);
}
