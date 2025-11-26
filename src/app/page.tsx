'use client';

import * as React from 'react';
import type { Chat, Message } from '@/lib/types';
import { ChatList } from '@/components/chat/chat-list';
import { ChatForm } from '@/components/chat/chat-form';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';


export default function Home() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Load chats from local storage
    try {
      const savedChats = localStorage.getItem('chats');
      if (savedChats) {
        const parsedChats: Chat[] = JSON.parse(savedChats).map((chat: Chat) => ({
          ...chat,
          messages: chat.messages.map((msg: Message) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })),
        }));
        setChats(parsedChats);
        if (parsedChats.length > 0 && !activeChatId) {
          setActiveChatId(parsedChats[0].id);
        }
      } else {
        startNewChat();
      }
    } catch (error) {
      console.error("Failed to parse chats from localStorage", error);
      startNewChat();
    }
  }, []);

  React.useEffect(() => {
    // On initial load, if there's no active chat but there are chats, set the first one as active.
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
    if (chats.length > 0) {
       try {
        localStorage.setItem('chats', JSON.stringify(chats));
      } catch (error) {
        console.error("Failed to save chats to localStorage", error);
      }
    }
  }, [chats, activeChatId]);

  const activeChat = React.useMemo(() => {
    return chats.find(chat => chat.id === activeChatId);
  }, [chats, activeChatId]);

  const startNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      createdAt: new Date(),
      messages: [],
    };
    // Add to the beginning of the list
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!navigator.onLine) {
      toast({
        variant: 'destructive',
        title: 'You are offline',
        description: 'Please check your internet connection and try again.',
      });
      return;
    }

    if (!activeChatId) return;
    
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      createdAt: new Date(),
    };

    setChats(prevChats =>
      prevChats.map(chat => {
        if (chat.id === activeChatId) {
          const isFirstMessage = chat.messages.length === 0;
          return {
            ...chat,
            title: isFirstMessage ? messageContent.substring(0, 30) : chat.title,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    );

    const assistantId = `assistant-${Date.now()}`;
    const placeholderMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    };

    setChats(prev => prev.map(c => c.id === activeChatId ? {...c, messages: [...c.messages, placeholderMessage]} : c));
    
    const currentChat = chats.find(c => c.id === activeChatId);
    const messagesForApi = currentChat ? [...currentChat.messages, userMessage] : [userMessage];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForApi.map(({id, createdAt, ...rest}) => rest) }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setChats(prevChats =>
            prevChats.map(chat => {
              if (chat.id === activeChatId) {
                return {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
                  )
                }
              }
              return chat;
            })
          );
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
       setChats(prevChats =>
            prevChats.map(chat => {
              if (chat.id === activeChatId) {
                return {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === assistantId
                    ? { ...msg, content: 'Sorry, I ran into a problem. Please try again.' }
                    : msg
                  )
                }
              }
              return chat;
            })
          );
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
        <Sidebar>
            <AppSidebar
                chats={chats}
                activeChatId={activeChatId}
                onChatSelect={setActiveChatId}
                onNewChat={startNewChat}
            />
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col h-full bg-background">
                <header className="flex items-center justify-end p-4 border-b shrink-0">
                     {mounted && (
                      <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setTheme('light')}>
                            <Sun className={cn("h-4 w-4", theme === 'light' && 'text-primary')} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setTheme('dark')}>
                            <Moon className={cn("h-4 w-4", theme === 'dark' && 'text-primary')} />
                        </Button>
                      </div>
                    )}
                </header>
                <main className="flex-1 overflow-y-auto">
                    <ChatList messages={activeChat?.messages ?? []} />
                </main>
                
                <div className="p-4 bg-background border-t shrink-0">
                    <ChatForm
                    input={input}
                    onInputChange={setInput}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    />
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
