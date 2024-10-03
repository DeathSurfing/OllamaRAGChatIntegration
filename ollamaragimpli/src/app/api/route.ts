import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama';

const ollama = new Ollama({
  host: 'http://localhost:11434', // Adjust this if your Ollama server is hosted elsewhere
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    const response = await ollama.chat({
      model: 'llama2', // or whichever model you're using
      messages: messages,
      stream: false,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return NextResponse.json({ error: 'Failed to get response from Ollama' }, { status: 500 });
  }
}