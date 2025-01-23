import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MonitoredAccount {
  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  reason: string;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  avatar: string | null;
}

class ResponseConfig {
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  words: number;
}

class PromptConfigItem {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  userPrompt: string;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  temperature: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  topK: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  topP: number;

  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  repetitionPenalty: number;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  interval: string;

  @ApiProperty({ type: [ResponseConfig] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseConfig)
  responses: ResponseConfig[];
}

class SystemPrompts {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  startPrompt: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  template: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  endPrompt: string;
}

class PromptConfig {
  @ApiProperty({ type: PromptConfigItem })
  @IsObject()
  POST: PromptConfigItem;

  @ApiProperty({ type: PromptConfigItem })
  @IsObject()
  REPLY: PromptConfigItem;

  @ApiProperty({ type: SystemPrompts })
  @IsObject()
  systemPrompts: SystemPrompts;
}

class CustomFunctionArgument {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  type: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  optional: boolean;
}

class CustomFunction {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  hint: string;

  @ApiProperty({ type: [CustomFunctionArgument] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFunctionArgument)
  arguments: CustomFunctionArgument[];

  @ApiProperty({ type: Object })
  @IsObject()
  request: Record<string, any>;

  @ApiProperty({ type: Object })
  @IsObject()
  response: Record<string, any>;

  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  isCustom: boolean;
}

class Data {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  ticker: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: String })
  @IsString()
  goal: string;

  @ApiProperty({ type: String })
  @IsString()
  worldInfo: string;

  @ApiProperty({ type: [MonitoredAccount] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitoredAccount)
  monitoredAccounts: MonitoredAccount[];

  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: PromptConfig })
  @ValidateNested()
  @Type(() => PromptConfig)
  promptConfig: PromptConfig;

  @ApiProperty({ type: [CustomFunction] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFunction)
  customFunctions: CustomFunction[];
}

export class CreateAgentDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  symbol: string;
}

export class UpdateAgentDto extends Data {
  @ApiProperty({ type: String })
  @IsString()
  userId: string;
}

export class SimulationDto extends UpdateAgentDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  text: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  postId: string;
}

export class UpdateStatusAgentDto {
  @ApiProperty({ type: String })
  @IsString()
  userId: string;
}
