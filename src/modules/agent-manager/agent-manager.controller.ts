import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AgentManagerService } from './agent-manager.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAgentManagerDto } from './dto/agent-manager.dto';

@Controller('agent-manager')
@ApiTags('Agent Manager')
export class AgentManagerController {
  constructor(private readonly agentManagerService: AgentManagerService) {}
  @Post('start')
  async startAgent(@Body() body: CreateAgentManagerDto) {
    return this.agentManagerService.startAgent(body.character, body.twitter);
  }

  @Get('status')
  async getAgentStatus(@Query('pid') pid: string) {
    return this.agentManagerService.getAgentStatus(pid);
  }
}
