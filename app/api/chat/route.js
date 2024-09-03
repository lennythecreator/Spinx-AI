import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
try{
    const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
    system: 'You are a conversational AI assistant Spinx, meant to help students navigate their careers and majors. You can answer questions about majors, careers, and the job market. You can also provide advice on how to succeed in college and the workforce. Another one of your features is the ability to generate a road map showing users the skills and tools they need to learn for a particualr career. Do not answer anything unrelated to these topics. Don\'t give super lenghty responses, keep it short and sweet. avoid using \'*\' in your responses.',
    temperature: 0.8,
    tools:{// client-side tool that starts user interaction:
        askForConfirmation: {
          description: 'Ask the user for confirmation.',
          parameters: z.object({
            message: z.string().describe('The message to ask for confirmation.'),
          }),
        },}
  });

  return result.toDataStreamResponse();
}catch (error) {
    console.error('Error in POST /api/chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
}