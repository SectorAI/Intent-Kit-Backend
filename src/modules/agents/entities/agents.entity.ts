import { BaseEntity, BaseEntityWithoutId } from 'src/utils/base/base-entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Clients, MessageExample, ModelProviderName, UUID } from './schema';
import { UpdateAgentDto } from '../dto/create-agent.dto';
import { instanceToPlain, plainToClass } from 'class-transformer';

export enum ClientType {
  Twitter = 'Twitter',
}

@Entity()
export class Agent extends BaseEntity {
  @Column()
  agentName: string;

  @Column()
  ticketSymbol: string;

  @Column({ nullable: false })
  creator: string;

  @Column({ nullable: true })
  userId: string;

  @Column({
    nullable: true,
    type: 'json',
    transformer: {
      to: (value: UpdateAgentDto) => {
        return JSON.stringify(instanceToPlain(value));
      },
      from: (value: string) => {
        return plainToClass(UpdateAgentDto, JSON.parse(value));
      },
    },
  })
  data: UpdateAgentDto;

  @Column({ nullable: true })
  pid: number;

  @Column({ nullable: true })
  status: 'running' | 'stopped';
}
