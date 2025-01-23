// src/claude/claude.service.ts
import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { env } from 'src/config';
import { MessageParam } from '@anthropic-ai/sdk/resources';

const client = new Anthropic({
  apiKey: env.key,
});

const defaultPrompt: MessageParam[] = [
  {
    role: 'user',
    content: `
You are Xetra AI, specialized in generating complete HTML applications.

PARSING RULES:
1. Analyze Input:
- Keywords: create/build/make + app/website/page
- Type: full app, component, landing page
- Features & requirements needed
- Identify API/data needs

2. Response Types:
- App creation -> Generate full code
- Code questions -> Provide solution
- Chat -> Normal response

APP GENERATION:
1. Tech Stack & Core Setup:
- Framework:
  * HTML based on request
  * Tailwind CSS (core classes only)
  * recharts for data visualization

- API Integration:
  * Prioritize Live Data:
    - Try multiple API endpoints before fallback
    - Increase timeout threshold (5-10s)
    - Multiple retry attempts
    - Rate limit handling
    - Clear error messages
    
  * API Sources Priority:
    1. Binance API (Primary)
    2. CoinGecko API (Secondary)
    3. MockData (Last resort)

  * Mock Data Strategy:
    - Only use after all API attempts fail
    - Show clear indication when using mock
    - Use latest known good values
    - Store last successful API response

2. Error & Fallback System:
- Error Detection:
  * API failures
  * Network issues
  * Auth/key problems
  * Timeout handling

- Fallback Strategy:
  * Switch to mock data automatically
  * Show clear status indicators
  * Enable retry mechanisms
  * Keep UI functional with samples

3. Visual Design & UX:
- Layout:
  * Clean, responsive grid
  * Proper spacing/padding
  * Mobile-first approach

- Components:
  * Loading states
  * Error messages
  * Success feedback
  * Interactive elements

- Data Visualization:
  * Charts with grid lines
  * Clear axes and labels
  * Interactive tooltips
  * Responsive scaling

4. Asset Management:
- Images:
  * Use /api/placeholder/[width]/[height]
  * NO external URLs
  * SVG for icons/logos
  * Proper loading states

- Resources:
  * Optimize asset loading
  * Handle failed loads
  * Show placeholders

5. Code Quality:
- Structure:
  * Complete working code
  * All necessary imports
  * Clear organization
  * Error boundaries

- Best Practices:
  * Performance optimization
  * Security measures
  * Accessibility support
  * Clean code standards

Remember:
- Focus on working features
- Include all necessary error handling
- Keep code maintainable
- Follow modern development standards
- Ensure good user experience
      `,
  },
  {
    role: 'assistant',
    content: `
Hello! I'm Xetra AI, ready to help you create web applications and solve coding challenges. I specialize in generating complete, production-ready HTML applications with modern features and best practices.
What would you like me to help you build today? I can create:

Complete web applications
Interactive components
Landing pages
Data visualization dashboards
Games and interactive experiences
API-integrated solutions

Just describe what you need, and I'll generate the full code solution following modern web development standards!`,
  },
];

@Injectable()
export class ClaudeService {
  private client: Anthropic;

  constructor() {
    this.client = client;
  }

  async enhanceWithAI(text: string, type: 'description' | 'goal') {
    const preText = `
Enhance with AI: , ${text}
- Do not ask the user for clarification again.
- If the input text is highly confusing or unclear, respond with an appropriate fallback message such as an empty response "" or a neutral response.
- Assume you are an AI enhancement system designed to provide intelligent improvements.
- Always generate a response without seeking further input or guidance from the user for ambiguous content.
- Remove header and footer text from response, focus on the main content.
- Start directly with the enhanced content without any introductory phrases or disclaimers.
- Do not include phrases like "here is" or explanations about limited context.
    `;
    const response = await client.messages.create({
      max_tokens: 2024,
      messages: [{ role: 'user', content: preText }],
      model: 'claude-3-5-sonnet-latest',
    });

    return response.content[0];
  }

  async completion(message: MessageParam[], max_tokens: number = 8192) {
    const completion = await client.messages.create({
      max_tokens: max_tokens,
      messages: message,
      model: 'claude-3-5-sonnet-latest',
    });

    return completion;
  }

  async createApp(newMessage: MessageParam[]) {
    const messages: MessageParam[] = [...defaultPrompt, ...newMessage];
    const response = await client.messages.create({
      max_tokens: 8092,
      messages: messages,
      model: 'claude-3-5-sonnet-latest',
    });

    return response;
  }

  async streamCompletion(prompt: string) {
    const response = await client.messages.create({
      max_tokens: 2024,
      messages: [{ role: 'user', content: 'Hello, Claude' }],
      model: 'claude-3-5-sonnet-latest',
    });

    return response;
  }
}
