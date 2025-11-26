'use client';

import * as React from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface ChatListProps {
  messages: Message[];
}

export function ChatList({ messages }: ChatListProps) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-semibold">Welcome to StreamChat AI</h2>
          <p className="text-muted-foreground mt-2">
            Start a conversation by typing a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="p-4 md:p-6" ref={viewportRef}>
            <div className={cn('flex flex-col gap-4')}>
                {messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </div>
        </div>
    </ScrollArea>
  );
}
