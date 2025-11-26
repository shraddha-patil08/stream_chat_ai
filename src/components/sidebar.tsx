'use client';
import * as React from 'react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Icons } from './icons';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import type { Chat } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface AppSidebarProps {
    chats: Chat[];
    activeChatId: string | null;
    onChatSelect: (id: string) => void;
    onNewChat: () => void;
}

export function AppSidebar({ chats, activeChatId, onChatSelect, onNewChat }: AppSidebarProps) {
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-sidebar-primary" />
            <span className="text-lg font-semibold">StreamChat AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <Button variant="outline" className="w-full" onClick={onNewChat}>
                <Plus className="-ml-2 h-4 w-4" />
                New Chat
            </Button>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarMenu>
            {chats.map(chat => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton 
                    isActive={chat.id === activeChatId}
                    onClick={() => onChatSelect(chat.id)}
                    className="flex-col items-start h-auto"
                >
                  <span className="font-medium">{chat.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDistanceToNow(chat.createdAt, { addSuffix: true })}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content can go here */}
      </SidebarFooter>
    </>
  );
}
