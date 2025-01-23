import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

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

class Request {
  @ApiProperty({ type: String })
  @IsString()
  method: string;

  @ApiProperty({ type: String })
  @IsString()
  url: string;

  @ApiProperty({ type: Object })
  @IsObject()
  headers: Record<string, any>;

  @ApiProperty({ type: Object })
  @IsObject()
  body: Record<string, any>;
}

class Response {
  @ApiProperty({ type: String })
  @IsString()
  success: string;

  @ApiProperty({ type: String })
  @IsString()
  error: string;
}

class FunctionInfo {
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

  @ApiProperty({ type: Request })
  @ValidateNested()
  @Type(() => Request)
  request: Request;

  @ApiProperty({ type: Response })
  @ValidateNested()
  @Type(() => Response)
  response: Response;

  @ApiProperty({ type: String })
  @IsString()
  type: string;
}

export class TestAgentDto {
  @ApiProperty({ type: String })
  @IsString()
  agent_id: string;

  @ApiProperty({ type: FunctionInfo })
  @ValidateNested()
  @Type(() => FunctionInfo)
  functionInfo: FunctionInfo;
}
