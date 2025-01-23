import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from './entities/agents.entity';
import { Repository } from 'typeorm';
import {
  CreateAgentDto,
  SimulationDto,
  UpdateAgentDto,
} from './dto/create-agent.dto';
import { TwitterUser } from './entities/twitterUser.entity';
import { AgentManagerService } from '../agent-manager/agent-manager.service';
import { TestAgentDto } from './dto/test-function.dto';
import axios from 'axios';

export const twitterPostTemplate = `
# About {{agentName}} (@{{twitterUserName}}):
{{description}}
{{goal}}

# Task: Generate a post in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Write a post that is from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Your response should be 1, 2, or 3 sentences (choose the length at random).
Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements if there are multiple statements in your response.`;

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent) private readonly repo: Repository<Agent>,
    @InjectRepository(TwitterUser)
    private readonly twitterUserRepository: Repository<TwitterUser>,
    private agentManagerService: AgentManagerService,
  ) {}

  async simulation(id: number, creator: string, dto: SimulationDto) {
    const agent = await this.repo.findOneBy({ id, creator });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const user = await this.twitterUserRepository.findOneBy({
      userId: agent.userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const character = this.getCharacter(dto, user);
    const simulate = await this.agentManagerService.simulateAgent(
      JSON.stringify(character),
      0,
    );
    return simulate;
  }

  async testFunction(walletAddress: string, dto: TestAgentDto) {
    const { functionInfo } = dto;
    const { request } = functionInfo;

    try {
      const response = await axios({
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.body,
      });

      let successMessage = functionInfo.response.success;
      const regex = /{{(.*?)}}/g;
      successMessage = successMessage.replace(regex, (_, key) => {
        const keys = key.split('.');
        if (keys[0] === 'response') {
          keys.shift(); // Remove the first element if it is 'response'
        }
        let value = response.data;
        for (const key of keys) {
          const arrayMatch = key.match(/(\w+)\[(\d+)\]/); // Handle array indexing like pairs[0]
          if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            value = value[arrayKey][index];
            console.log(arrayKey, index);
          } else {
            value = value[key];
          }
          console.log(value);
          if (value === undefined) break;
        }
        return JSON.stringify(value);
      });
      return {
        success: successMessage,
      };
    } catch (error) {
      throw new HttpException(functionInfo.response.error, 500);
    }
  }

  async createAgent(creator: string, dto: CreateAgentDto) {
    const agent = new Agent();
    agent.agentName = dto.name;
    agent.ticketSymbol = dto.symbol;
    agent.creator = creator;
    agent.status = 'stopped';

    await this.repo.save(agent);
    return agent;
  }

  async updateAgent(id: number, creator: string, dto: UpdateAgentDto) {
    const agent = await this.repo.findOneBy({
      id,
    });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const user = await this.twitterUserRepository.findOneBy({
      userId: dto.userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    agent.data = dto;
    const character = this.getCharacter(dto, user);
    let pid = 0;
    try {
      const response = await this.agentManagerService.startAgent(
        JSON.stringify(character),
        this.getUserAuthDetails(user),
      );
      const oldPid = agent.pid;
      if (oldPid) {
        try {
          await this.agentManagerService.stopAgent(oldPid.toString());
        } catch (error) {
          console.error(error);
        }
      }
      pid = Number(response.pid);
      agent.pid = pid;
      agent.status = 'running';
      agent.userId = dto.userId;
      await this.repo.save(agent);
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to start agent', 500);
    }
    return agent;
  }

  private getCharacter(dto: UpdateAgentDto, user: TwitterUser) {
    const replyInterval = isNaN(Number(dto.promptConfig.REPLY.interval))
      ? 30
      : Number(dto.promptConfig.REPLY.interval);
    const postInterval = isNaN(Number(dto.promptConfig.POST.interval))
      ? 30
      : Number(dto.promptConfig.POST.interval);
    return {
      ...dto,
      promptConfig: {
        POST: {
          userPrompt: twitterPostTemplate + dto.promptConfig.POST.userPrompt,
          modelConfig: {
            temperature: dto.promptConfig.POST.temperature,
            frequency_penalty: 0.5,
            max_response_length: 100,
            maxInputTokens: 100,
            presence_penalty: dto.promptConfig.POST.repetitionPenalty,
          },
          intervalMin: postInterval,
          intervalMax: 60,
        },
        REPLY: {
          userPrompt: dto.promptConfig.REPLY.userPrompt,
          modelConfig: {
            temperature: dto.promptConfig.REPLY.temperature,
            frequency_penalty: 0.5,
            max_response_length: 100,
            maxInputTokens: 100,
            presence_penalty: dto.promptConfig.REPLY.repetitionPenalty,
          },
          intervalMin: replyInterval,
          intervalMax: 60,
        },
        QUOTE: {
          userPrompt: dto.promptConfig.POST.userPrompt,
          modelConfig: {
            temperature: dto.promptConfig.POST.temperature,
            frequency_penalty: 0.5,
            max_response_length: 100,
            maxInputTokens: 100,
            presence_penalty: dto.promptConfig.POST.repetitionPenalty,
          },
          intervalMin: postInterval,
          intervalMax: 60,
        },
      },
      twitterProfile: {
        id: user.userId,
        username: user.username,
        screenName: user.screenName,
      },
    };
  }

  async updateStatusAgent(id: number, creator: string) {
    const agent = await this.repo.findOneBy({ id, creator });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const user = await this.twitterUserRepository.findOneBy({
      userId: agent.userId,
    });
    if (!user) {
      agent.status = agent.status === 'running' ? 'stopped' : 'running';
      await this.repo.save(agent);
      return;
    }
    if (agent.status === 'running') {
      try {
        await this.agentManagerService.getAgentStatus(agent.pid.toString());
        agent.status = 'stopped';
      } catch (error) {
        agent.status = 'stopped';
      }
    } else {
      const character = this.getCharacter(agent.data, user);
      let pid = 0;
      try {
        const response = await this.agentManagerService.startAgent(
          JSON.stringify(character),
          this.getUserAuthDetails(user),
        );
        pid = Number(response.pid);
        agent.pid = pid;
        agent.status = 'running';
      } catch (error) {
        console.error(error);
        throw new HttpException('Failed to start agent', 500);
      }
    }
    await this.repo.save(agent);
    return {
      status: agent.status,
    };
  }

  public async restart(id: number) {
    const agent = await this.repo.findOneBy({ id });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const user = await this.twitterUserRepository.findOneBy({
      userId: agent.userId,
    });

    const character = this.getCharacter(agent.data, user);
    let pid = 0;
    try {
      const response = await this.agentManagerService.startAgent(
        JSON.stringify(character),
        this.getUserAuthDetails(user),
      );
      pid = Number(response.pid);
      agent.pid = pid;
      agent.status = 'running';
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to start agent', 500);
    }
    await this.repo.save(agent);
    return {
      status: agent.status,
    };
  }

  private getUserAuthDetails(user: TwitterUser): {
    username: string;
    token: string;
    secret: string;
  } {
    return {
      secret: user.accessSecret,
      token: user.accessToken,
      username: user.username,
    };
  }

  async findMyAgent(address: string) {
    const data = await this.repo.findBy({ creator: address });
    return data;
  }

  async findOne(id: number, creator: string) {
    const data = await this.repo.findOneBy({
      id,
      creator,
    });
    if (data === undefined) {
      throw new HttpException('Agent not found', 404);
    }
    let status = 'stopped';
    try {
      const res = await this.agentManagerService.getAgentStatus(
        data.pid.toString(),
      );
      status = res.status;
    } catch (error) {}
    return {
      ...data,
      status,
    };
  }
}
