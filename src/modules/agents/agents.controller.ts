import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AgentResponse } from './dto/response-agent.dto';
import {
  CreateAgentDto,
  SimulationDto,
  UpdateAgentDto,
} from './dto/create-agent.dto';
import { WalletAddress } from 'src/decorators/headers.decorator';
import { TestAgentDto } from './dto/test-function.dto';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('/simulation/:id')
  async simulation(
    @WalletAddress() walletAddress: string,
    @Param('id') id: number,
    @Body() dto: SimulationDto,
  ) {
    return await this.agentsService.simulation(id, walletAddress, dto);
  }

  @Post('/test-function')
  async testFunction(
    @WalletAddress() walletAddress: string,
    @Body() dto: TestAgentDto,
  ) {
    return await this.agentsService.testFunction(walletAddress, dto);
  }

  @Get('/my-agent/:address')
  findMyAgents(@Param('address') address: string) {
    return this.agentsService.findMyAgent(address);
  }

  @Get('/detail/:id')
  findOne(@WalletAddress() walletAddress: string, @Param('id') id: number) {
    return this.agentsService.findOne(id, walletAddress);
  }

  @Post()
  @ApiOkResponse({ status: 201, type: AgentResponse })
  async createNewAgent(
    @WalletAddress() walletAddress: string,
    @Body() dto: CreateAgentDto,
  ) {
    return await this.agentsService.createAgent(walletAddress, dto);
  }

  @Patch('/update/:id')
  async updateAgent(
    @WalletAddress() walletAddress: string,
    @Param('id') id: number,
    @Body() dto: UpdateAgentDto,
  ) {
    return await this.agentsService.updateAgent(+id, walletAddress, dto);
  }

  @Patch('/update-status/:id')
  async updateStatusAgent(
    @WalletAddress() walletAddress: string,
    @Param('id') id: number,
  ) {
    return await this.agentsService.updateStatusAgent(id, walletAddress);
  }

  @Patch('/restart/:id')
  async restart(
    @Param('id') id: number,
  ) {
    return await this.agentsService.restart(id);
  }
}
