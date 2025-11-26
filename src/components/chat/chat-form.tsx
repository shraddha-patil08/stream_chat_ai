'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { SendHorizontal, LoaderCircle } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface ChatFormProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatForm({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
}: ChatFormProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    onInputChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      onSendMessage(input);
      onInputChange('');
    }
  };
  
  React.useEffect(() => {
    if(!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Textarea
        ref={inputRef}
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="flex-1 resize-none"
        rows={1}
        disabled={isLoading}
        aria-label="Chat input"
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        aria-label={isLoading ? 'Sending message' : 'Send message'}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <SendHorizontal />
        )}
      </Button>
    </form>
  );
}
