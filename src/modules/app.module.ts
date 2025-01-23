import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';

import { env } from 'src/config';
import dataSource from 'src/libs/typeorm.config';
import { ClaudeModule } from './claude/claude.module';
import { RouterModule } from '@nestjs/core';
import { AgentsModule, agentsRoutes } from './agents/agents.module';
import { AgentManagerModule } from './agent-manager/agent-manager.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(dataSource.options),
    RedisModule.forRoot({
      type: 'single',
      url: env.redis.url,
    }),
    ClaudeModule,
    AgentsModule,
    RouterModule.register(agentsRoutes),
    AgentManagerModule,
  ],
})
export class AppModule {}
