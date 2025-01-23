import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { nanoid } from 'nanoid';
import { env } from 'src/config';
import { TwitterApi } from 'twitter-api-v2';
import {
  TwitterCallbackDto,
  TwitterGetAuthUrlDto,
} from './dto/twitter-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwitterUser } from '../entities/twitterUser.entity';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(TwitterUser)
    private readonly twitterUserRepository: Repository<TwitterUser>,
  ) {}

  async getTwitterAuthUrl({ callbackUrl, address }: TwitterGetAuthUrlDto) {
    try {
      const client = this.getTwitterClient();
      const authLink = await client.generateAuthLink(
        callbackUrl || env.twitter.callbackUrl,
        { linkMode: 'authorize' },
      );

      const data = {
        address,
        oauthSecret: authLink.oauth_token_secret,
      };

      await this.redis.set(
        authLink.oauth_token,
        JSON.stringify(data),
        'EX',
        60 * 10,
      );
      return { url: authLink.url };
    } catch (error) {
      this.logger.debug(error);
      throw new BadRequestException('Failed to get twitter auth url.');
    }
  }

  async twitterCallback(dto: TwitterCallbackDto) {
    try {
      const { oauthToken, oauthVerifier } = dto;
      console.log('Authored', oauthToken);
      const { address, oauthSecret } = JSON.parse(
        await this.redis.get(oauthToken),
      );

      if (!oauthSecret) {
        throw new BadRequestException('Invalid oauth token');
      }

      const client = this.getTwitterClient(oauthToken, oauthSecret);

      const loginResult = await client.login(oauthVerifier);
      const profile = await loginResult.client.currentUserV2();
      const username = profile.data.username;
      // TODO: Save user to database
      const user = await this.twitterUserRepository.findOne({
        where: { userId: loginResult.userId },
      });
      if (!user) {
        const newTwitterUser = new TwitterUser();
        newTwitterUser.userId = loginResult.userId;
        newTwitterUser.address = address;
        newTwitterUser.username = username;
        newTwitterUser.screenName = loginResult.screenName;
        newTwitterUser.accessSecret = loginResult.accessSecret;
        newTwitterUser.accessToken = loginResult.accessToken;
        try {
          await this.twitterUserRepository.save(newTwitterUser);
        } catch (error) {
          this.logger.error(error);
        }
      } else {
        user.accessSecret = loginResult.accessSecret;
        user.accessToken = loginResult.accessToken;
        try {
          await this.twitterUserRepository.save(user);
        } catch (error) {
          this.logger.error(error);
        }
      }

      return { username, userId: loginResult.userId };
    } catch (error) {
      this.logger.debug(error);
      throw new UnauthorizedException('Failed to login with twitter');
    }
  }

  private getTwitterClient(accessToken?: string, accessSecret?: string) {
    return new TwitterApi({
      appKey: env.twitter.consumerKey,
      appSecret: env.twitter.consumerSecret,
      accessToken,
      accessSecret,
    });
  }
  ƒ;
}
