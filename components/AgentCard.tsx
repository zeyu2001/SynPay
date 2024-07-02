import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@prisma/client';
import { Button } from './ui/button';
import { AgentForm } from './AgentForm';

export const AgentCard = (agent: Agent) => {
  return (
    <Card className="relative py-2">
      {agent.public ? (
        <Badge className="absolute -top-2 -left-2">Public</Badge>
      ) : (
        <Badge className="absolute -top-2 -left-2" variant="secondary">
          Draft
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.url}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{agent.description}</p>
        <p className="py-2 text-sm text-gray-500">
          Balance: ${agent.balance} | Cost: ${agent.cost}
        </p>
      </CardContent>
      <CardFooter>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Edit</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-full w-1/2">
            <ScrollArea className="h-full w-full">
              <SheetHeader className="mb-4">
                <SheetTitle>Edit agent</SheetTitle>
                <SheetDescription>Make changes to your agent here.</SheetDescription>
              </SheetHeader>
              <AgentForm agent={agent} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
};
