import { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';

const db = new DB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === 'GET') {
    const agent = await db.getAgentById(id as string);
    if (!agent) return res.status(404).end();
    return res.status(200).json(agent.schema);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
