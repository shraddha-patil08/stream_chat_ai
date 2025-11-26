'use client';

import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
    </div>
  );
}

// Function to remove markdown symbols
function cleanMarkdown(text: string): string {
  if (!text) return '';
  // Remove bold, italic, strikethrough, headings, list items, and code blocks
  return text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/#{1,6}\s/g, '') // headings
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // code
    .replace(/^[*\-]\s/gm, ''); // list items
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = message.role === 'assistant' && message.content === '';
  const { toast } = useToast();

  const formattedTimestamp = formatDistanceToNow(message.createdAt, {
    addSuffix: true,
  });

  const displayContent = isUser ? message.content : cleanMarkdown(message.content);

  const onCopy = () => {
    navigator.clipboard.writeText(displayContent);
    toast({
        title: 'Copied!',
        description: 'Message copied to clipboard.',
    })
  }

  return (
    <div
      className={cn(
        'group flex w-full max-w-[80%] items-start gap-3 animate-in fade-in',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback>
          {isUser ? <User /> : <Icons.bot />}
        </AvatarFallback>
      </Avatar>
      <div className={cn('flex flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'relative rounded-lg p-3 text-sm shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isStreaming ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{displayContent}</p>}
          {!isUser && !isStreaming && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute -bottom-8 right-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={onCopy}
            >
                <Copy className="h-4 w-4"/>
                <span className="sr-only">Copy message</span>
            </Button>
          )}
        </div>
        <span
          className="text-xs text-muted-foreground"
          title={message.createdAt.toLocaleString()}
        >
          {formattedTimestamp}
        </span>
      </div>
    </div>
  );
}
