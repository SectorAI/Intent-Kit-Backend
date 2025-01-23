import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MessageClaude {
  @ApiProperty({
    type: String,
    enum: ['user', 'assistant'],
    description: 'define the role of the message',
    example: 'user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'assistant';

  @ApiProperty({
    type: String,
    description: 'the wallet name',
    example: 'wallet1',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class MessageRequest {
  @ApiProperty({
    type: [MessageClaude],
    required: true,
  })
  @IsNotEmpty()
  messages: MessageClaude[];
}

export class EnhanceAIDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  type: 'description' | 'goal';
}
