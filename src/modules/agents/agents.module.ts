import { Module } from '@nestjs/common';
import { Routes } from '@nestjs/core';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { ClientsModule } from './clients/clients.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent } from './entities/agents.entity';
import { TwitterUser } from './entities/twitterUser.entity';
import { AgentManagerService } from '../agent-manager/agent-manager.service';

@Module({
  controllers: [AgentsController],
  providers: [AgentsService, AgentManagerService],
  imports: [ClientsModule, TypeOrmModule.forFeature([Agent, TwitterUser])],
})
export class AgentsModule {}

export const agentsRoutes: Routes = [
  {
    path: 'agents',
    module: AgentsModule,
    children: [
      {
        path: '/',
        module: ClientsModule,
      },
    ],
  },
];
