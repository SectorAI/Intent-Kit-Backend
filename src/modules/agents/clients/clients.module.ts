import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitterUser } from '../entities/twitterUser.entity';

@Module({
  imports: [ClientsModule, TypeOrmModule.forFeature([TwitterUser])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
