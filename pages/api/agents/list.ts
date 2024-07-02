import type { NextApiRequest, NextApiResponse } from 'next';
import DB from '@/util/db';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/util/authOptions';
import { formSchema } from '@/components/AgentForm';
import { Agent } from '@prisma/client';
import type { PublicAgent } from '@/types/agents';

const db = new DB();

interface AgentsListResponse {
  mine: Agent[];
  others: PublicAgent[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentsListResponse>,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401);

  if (req.method === 'GET') {
    const user = await db.getUser(session.user.email);
    if (!user) return res.status(401);

    const agents = await db.getAllAgents();
    const mine = agents.filter(agent => agent.userId === user.id);
    const others = agents
      .filter(agent => agent.userId !== user.id && agent.public)
      .map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        public: agent.public,
        cost: agent.cost,
        schema: JSON.parse(agent.schema),
      }));
    return res.status(200).json({ mine, others });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
