import { Module } from '@nestjs/common';
import { AgentManagerService } from './agent-manager.service';
import { AgentManagerController } from './agent-manager.controller';

@Module({
  controllers: [AgentManagerController],
  providers: [AgentManagerService],
})
export class AgentManagerModule {}
