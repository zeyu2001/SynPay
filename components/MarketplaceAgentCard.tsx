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
import { Agent } from '@prisma/client';
import { Button } from './ui/button';
import { AgentsComboBox } from '@/components/AgentsComboBox';

export const MarketplaceAgentCard = ({ agent, myAgent }: { agent: Agent; myAgent: Agent[] }) => {
  return (
    <Card className="relative py-2">
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{agent.description}</p>
        <p className="py-2 text-sm text-gray-500">Cost: ${agent.cost} per request</p>
      </CardContent>
      <CardFooter>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Use</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-full w-1/2">
            <ScrollArea className="h-full w-full">
              <SheetHeader>
                <SheetTitle>Use this agent</SheetTitle>
                <SheetDescription>
                  Here&apos;s an example of how you can use this agent with Langchain.
                </SheetDescription>
                <AgentsComboBox agents={myAgent} />

                <pre className="p-4 bg-gray-100 rounded-lg text-sm">
                  <code>test</code>
                </pre>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
};
