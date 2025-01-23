import Redis from 'ioredis';
import { STAKE_FACTORY_ADDRESS, MEME_FACTORY_BLOCKNUMBER } from './constant';

export enum RedisKey {
  price_native = 'price:native',

  create_meme_offchain = 'create_meme_offchain',

  stake_event_block_number = 'stake_event_block_number',

  meme_token_map = 'meme_token_map',

  flag = 'flag',
  is_syncing_meme = 'is_syncing_meme',
  is_syncing_analytic = 'is_syncing_analytic',
  is_syncing_offchain_data = 'is_syncing_offchain_data',

  king_of_the_hill = 'king_of_the_hill',

  stake = 'stake', // stake:address:amount
  reward_history = 'reward_history', // reward_history:address
  stake_history = 'stake_history', // stake_history:address
}

export const getMemeCheckPoint = async (redis: Redis) => {
  const blockNumber = await redis.hget(
    RedisKey.stake_event_block_number,
    STAKE_FACTORY_ADDRESS,
  );
  return blockNumber ? Number(blockNumber) : MEME_FACTORY_BLOCKNUMBER;
};
