import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/util/authOptions';
import { formSchema } from '@/components/AgentForm';
import OpenAPIParser from '@readme/openapi-parser';

const db = new DB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401);

  if (req.method === 'POST') {
    const user = await db.getUser(session.user.email);
    if (!user) return res.status(401);

    let body, api;
    try {
      body = formSchema.parse(req.body);
      api = (await OpenAPIParser.parse(JSON.parse(body.schema))) as any;
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
    if (!body.id) {
      return res.status(400).json({ message: 'Missing agent ID' });
    }
    const name = body.name;
    const existing = await db.getAgentByName(name);
    if (existing && existing.id !== body.id) {
      return res.status(400).json({ message: 'An agent with that name already exists.' });
    }
    const agent = await db.getAgentById(body.id);
    if (!agent || agent.userId !== user.id) {
      return res.status(403).json({ message: 'You do not have permission to update this agent.' });
    }
    const url = api.servers[0].url;
    api.servers = [
      {
        url: `${req.headers.host}/api/agents/${name}`,
      },
    ];
    const result = await db.upsertAgent({
      name,
      description: body.description,
      schema: JSON.stringify(api),
      balance: body.balance,
      cost: body.cost,
      pub: body.public,
      url,
      userId: user.id,
      id: body.id,
    });
    return res.status(200).json(result);
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
