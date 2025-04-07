import type { APIRoute } from 'astro';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY || "" });

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!request.body) {
      throw new Error('Request body is empty');
    }

    const body = await request.json();
    if (!body || typeof body.message !== 'string') {
      throw new Error('Invalid message format');
    }

    const { message } = body;
    console.log('Received message:', message);
    
    // Here you can add your chat logic, API calls, etc.
    const response = `Hello ${message}`; // Simple echo response for now
    
    console.log('Sending response:', response);
    
    return new Response(JSON.stringify({ 
      text: response 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
