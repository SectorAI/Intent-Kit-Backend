import Redis from 'ioredis';
import { RedisKey } from './RedisKey';

export const setSyncingLock = async (redis: Redis, name: string) => {
  const key = `${RedisKey.flag}:${name}`;
  const result = await redis.set(key, '1', 'NX');
  if (result) {
    await redis.expire(key, 10);
  }
  return result;
};

export const releaseSyncingLock = async (redis: Redis, name: string) => {
  const key = `${RedisKey.flag}:${name}`;
  await redis.del(key);
};

export const isSyncing = async (redis: Redis, name: string) => {
  const key = `${RedisKey.flag}:${name}`;
  return await redis.get(key);
};export const getKey = (prefix: string, address: string) => {
  return `${prefix}:${address}`;
};

