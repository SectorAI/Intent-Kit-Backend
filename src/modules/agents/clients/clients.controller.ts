import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  TwitterAuthUrlResponseDto,
  TwitterCallbackDto,
  TwitterGetAuthUrlDto,
} from './dto/twitter-client.dto';

@ApiTags('Agents - Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('/twitter/get-auth-url')
  @ApiOkResponse({ type: TwitterAuthUrlResponseDto, status: 200 })
  async getTwitterAuthUrl(@Query() dto: TwitterGetAuthUrlDto) {
    return this.clientsService.getTwitterAuthUrl(dto);
  }

  @Get('/twitter/callback')
  async twitterCallback(@Query() dto: TwitterCallbackDto) {
    return this.clientsService.twitterCallback(dto);
  }

  @Post('/twitter/callback')
  async twitterCallbackPost(@Body() dto: TwitterCallbackDto) {
    return this.clientsService.twitterCallback(dto);
  }
}
