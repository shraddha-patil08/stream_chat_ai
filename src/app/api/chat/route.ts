import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Groq from 'groq-sdk';
import { Readable } from 'stream';

export const runtime = 'nodejs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = chatRequestSchema.safeParse(json);

    if (!parseResult.success) {
      return new Response(JSON.stringify(parseResult.error), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = parseResult.data;

    const groqStream = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful and friendly AI assistant called StreamChat AI. You must not use any markdown syntax. For example, do not use **, *, #, -, or ```.',
        },
        ...messages,
      ],
      model: 'llama-3.1-8b-instant',
      stream: true,
    });
    
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of groqStream) {
          const data = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(data);
        }
        controller.close();
      },
    });
    
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
    
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: 'Failed to process chat message', details: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
