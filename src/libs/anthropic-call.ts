import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';
import { env } from 'src/config';

const anthropic = new Anthropic({
  apiKey: env.key,
});

const getData = async (messages: MessageParam[]) => {
  const stream = await anthropic.messages.create({
    max_tokens: 2024,
    messages: messages,
    model: 'claude-3-5-sonnet-latest',
    stream: true,
  });
  for await (const messageStreamEvent of stream) {
    console.log(messageStreamEvent);
  }
};

export { getData };
