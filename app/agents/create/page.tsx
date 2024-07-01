'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().min(2).max(255),
  schema: z.string(),
  balance: z.coerce.number().positive(),
  cost: z.coerce.number().positive(),
});

export function AgentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      schema: `{
        openapi: '3.1.0',
        info: {
          title: 'Get weather data',
          description: 'Retrieves current weather data for a location.',
          version: 'v1.0.0',
        },
        servers: [
          {
            url: 'https://weather.example.com',
          },
        ],
        paths: {
          '/location': {
            get: {
              description: 'Get temperature for a specific location',
              operationId: 'GetCurrentWeather',
              parameters: [
                {
                  name: 'location',
                  in: 'query',
                  description: 'The city and state to retrieve the weather for',
                  required: true,
                  schema: {
                    type: 'string',
                  },
                },
              ],
              deprecated: false,
            },
          },
        },
        components: {
          schemas: {},
        },
      }`,
      url: '',
      balance: 0,
      cost: 0,
      public: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <FormControl>
                <Input placeholder="Weather AI" {...field} />
              </FormControl>
              <FormDescription>This is your agent's public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="A short description of your agent." {...field} />
              </FormControl>
              <FormDescription>What does your agent do?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Schema</FormLabel>
              <FormControl>
                <Textarea {...field} className="font-mono h-96" />
              </FormControl>
              <FormDescription>The OpenAPI schema to access your agent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>Give your agent an initial balance.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>How much does your agent cost to use per request?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-gray-500">
          Publishing your agent will make it available to the public. If you save it as a draft,
          your agent can still spend money but others won't be able to access it.
        </p>
        <Button type="submit" value="draft" variant="secondary" className="mr-4">
          Save Draft
        </Button>
        <Button type="submit" value="publish">
          Publish
        </Button>
      </form>
    </Form>
  );
}

export default AgentForm;
