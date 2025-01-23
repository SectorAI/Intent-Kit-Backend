// src/claude/claude.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ClaudeService } from './claude.service';
import { ApiTags } from '@nestjs/swagger';
import { EnhanceAIDto, MessageRequest } from './dto/message.dto';
import { MessageParam } from '@anthropic-ai/sdk/resources';

@Controller('claude')
@ApiTags('Claude')
export class ClaudeController {
  constructor(private readonly claudeService: ClaudeService) {}

  @Post('/enhance-with-ai')
  async enhanceWithAI(@Body() messages: EnhanceAIDto) {
    const anthropicStream = await this.claudeService.enhanceWithAI(messages.text, messages.type);
    return anthropicStream
  }

  @Post('stream')
  async createClaudePrompt(@Body() messages: MessageRequest) {
    const messageParams: MessageParam[] = messages.messages.map((message) => {
      return { role: message.role, content: message.content };
    });
    const anthropicStream = await this.claudeService.createApp(messageParams);
    return anthropicStream;
  }

  @Post('promptEz')
  async promptEz(@Body() messages: MessageRequest) {
    const messageParams: MessageParam[] = messages.messages.map((message) => {
      return { role: message.role, content: message.content };
    });
    const anthropicStream = await this.claudeService.completion(messageParams);
    return anthropicStream;
  }
}
