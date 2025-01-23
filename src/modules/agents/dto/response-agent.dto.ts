import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/utils/base/base-entity';
import { ClientType } from '../entities/agents.entity';

export class AgentResponse extends BaseEntity {
  @ApiResponseProperty({ type: String })
  name: string;

  @ApiResponseProperty({ type: String })
  creator: string;

  @ApiResponseProperty({ type: String })
  tokenAddress: string;

  @ApiResponseProperty({ type: [String], enum: ClientType })
  clients: ClientType[];

  @ApiResponseProperty({ type: [String] })
  bio: string[];

  @ApiResponseProperty({ type: [String] })
  lore: string[];
}
