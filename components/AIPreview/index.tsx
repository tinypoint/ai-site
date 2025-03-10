"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { llmJsonParse, transformWeightsMapToTree } from '@/utils';
import { IFinalData, IQuerys, IWeight, IWeightTreeNode, Message } from '@/types';
import { weightMaps } from '@/components/WeightMaps';
import { createEventHandlers } from '@/utils/event';
import useLowCodeStore from '@/hooks/useLowCodeStore';
import { parseObjectExpressions } from '@/utils/expression';
import { ReplyOptions, Vessel, VesselMessage } from '@opensea/vessel';
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Bot, Settings, Home } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const ComponentWrapper = (context: {
  component: React.ComponentType<any>,
  node: IWeight,
  name: string,
  children: React.ReactNode,
  querys: IQuerys
}) => {
  const { component: Component, node, name, children, querys } = context;
  const { layout, props = {}, events } = node;

  const expressionContext = useLowCodeStore(state => state.expressionContext);
  const callWeightMethod = useLowCodeStore(state => state.callWeightMethod);
  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);
  const getExpressionContext = useLowCodeStore(state => state.getExpressionContext);
  const getAllExpressionContext = useLowCodeStore(state => state.getAllExpressionContext);
  const eventHandlers = createEventHandlers(
    events || {},
    querys,
    callWeightMethod,
    updateExpressionContext,
    getExpressionContext,
    getAllExpressionContext
  );

  const parsedProps = parseObjectExpressions(props, expressionContext);

  if (name.startsWith('Table')) {
    // console.log('expressionContext', expressionContext)
    // console.log(name, 'props', props)
    // console.log(name, 'parsedProps', parsedProps)
  }

  return (
    <Component
      name={name}
      layout={layout || {}}
      eventHandlers={eventHandlers}
      {...parsedProps}
    >
      {children}
    </Component >
  )
};

export default function AIPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const vessel = useRef<Vessel | null>(null);

  const lastAIMessage = messages.findLast((msg) => msg.role === 'ai');

  const updateExpressionContext = useLowCodeStore(state => state.updateExpressionContext);


  const { routes = [] } = useMemo(() => {
    const parsedData = llmJsonParse(lastAIMessage?.artifact?.navigation || '{}');
    return typeof parsedData === 'object' && parsedData !== null ? parsedData as { routes: any[] } : {} as { routes: any[] };
  }, [lastAIMessage?.artifact?.navigation])

  const data = Object.values(lastAIMessage?.artifact?.pages || {}).map(page => page.dsl)[0] || ({} as IFinalData);
  const { weights = {}, querys = {} } = data;

  useEffect(() => {
    if (!vessel.current) {
      vessel.current = new Vessel({});
    }

    vessel.current?.send({
      type: 'iframeReady',
    }).then((res) => {
      setMessages(res as unknown as Message[]);
    }).catch((err) => {
    });
    const listener = (message: VesselMessage<unknown>, reply: (response?: unknown, options?: ReplyOptions) => void) => {
      if (typeof message.payload === 'object') {
        const payload = message.payload as { type: string, messages: Message[] };
        if (payload.type === 'updateMessages') {
          setMessages(payload.messages);
        }
      }
      const result = 'hi'
      reply(result)
      return true
    }
    vessel.current.addListener('message', listener);

    return () => {
      vessel.current?.removeListener('message', listener);
    }
  }, []);

  useEffect(() => {
    Object.keys(querys).forEach(queryName => {
      updateExpressionContext(queryName, {
        ...querys[queryName],
        loading: false,
        response: null,
        mockResponse: querys[queryName]?.response,
      });
    });

    return () => {
      Object.keys(querys).forEach(queryName => {
        updateExpressionContext(queryName, undefined);
      });
    }

  }, [querys]);




  useEffect(() => {
    updateExpressionContext('routes', routes)
  }, [routes])
  const rootWeight = useMemo(() => transformWeightsMapToTree(weights), [weights]);

  const renderComponent = (node: IWeightTreeNode): React.ReactNode => {
    const { name, type, children } = node;
    const Component = weightMaps[type];
    if (!Component) return null;

    return (
      <ComponentWrapper
        component={Component}
        node={node}
        name={name}
        key={name}
        querys={querys}
      >
        {(children || []).map(renderComponent)}
      </ComponentWrapper>
    );
  };

  return (
    <div className="w-screen h-screen overflow-x-auto overflow-y-hidden">
      <div className='w-full min-w-[1280px] h-full flex'>
        <div className='w-60 h-full border-r shrink-0 flex flex-col justify-between'>
          <div className="flex flex-col gap-2">
            <div className="flex h-14 items-center">
              <Bot className='ml-8 w-12 h-12' />
            </div>
            <NavigationMenu className='pl-4'>
              <NavigationMenuList className="flex flex-col items-start space-x-0">
                {
                  Array.isArray(routes) && routes.map((route) => {
                    return (
                      <NavigationMenuItem key={route.pageId}>
                        <Link href={route.path || ''} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <Home className='w-4 h-4 mr-2' />
                            {route.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })
                }
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex justify-end items-center h-14 border-t">
            <Button variant='outline' size='icon' className='mr-4'>
              <Settings className='w-4 h-4' />
            </Button>
          </div>
        </div>
        <div className='flex-1 flex flex-col'>
          <div className='h-14 px-2 py-1 border-b'>
            <div className='flex items-center justify-between h-full'>
              <Input placeholder='Search' className='w-60 rounded-full'></Input>
              <Avatar className="w-8 h-8 bg-gray-200 ml-8 mr-2">
                U
              </Avatar>
            </div>
          </div>
          <div className='h-0 flex-1 overflow-y-auto overflow-x-hidden'>
            {rootWeight && renderComponent(rootWeight)}
          </div>
        </div>
      </div>
    </div>
  );
};
