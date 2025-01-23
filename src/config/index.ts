import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

export const isLocal = process.env.NODE_ENV === 'local';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test', 'local', 'staging')
      .required(),
    PORT: Joi.number().default(3000),
    NETWORK: Joi.string().default('mainnet').valid('mainnet', 'testnet'),

    DATABASE_URL: Joi.string().required(),

    REDIS_URL: Joi.string().required(),

    BUCKET_NAME: Joi.string().required(),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_HOST: Joi.string().required(),
    MINIO_PORT: Joi.number().required(),
    MINIO_SECRET_KEY: Joi.string().required(),

    KEY: Joi.string(),

    IS_FREE: Joi.boolean().default(true),
    IS_RUNNING_WORKER: Joi.boolean().default(true),
    RPC: Joi.string().required(),

    TWITTER_CONSUMER_KEY: Joi.string().required(),
    TWITTER_CONSUMER_SECRET: Joi.string().required(),
    TWITTER_CALLBACK_URL: Joi.string().required(),
    AGENT_RPC_URL: Joi.string().default('143.198.223.209:32009'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error != null) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  workerPort: envVars.WORKER_PORT,
  network: envVars.NETWORK,

  postgres: {
    url: envVars.DATABASE_URL,
  },
  redis: {
    url: envVars.REDIS_URL,
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
    db: envVars.REDIS_DB,
    username: envVars.REDIS_USERNAME,
  },
  minio: {
    accessKey: envVars.MINIO_ACCESS_KEY,
    bucket: envVars.BUCKET_NAME,
    host: envVars.MINIO_HOST,
    port: envVars.MINIO_PORT,
    secretKey: envVars.MINIO_SECRET_KEY,
  },
  key: envVars.KEY,
  flag: {
    isFree: envVars.IS_FREE,
    isRunningWorker: envVars.IS_RUNNING_WORKER,
  },
  twitter: {
    consumerKey: envVars.TWITTER_CONSUMER_KEY,
    consumerSecret: envVars.TWITTER_CONSUMER_SECRET,
    callbackUrl: envVars.TWITTER_CALLBACK_URL,
  },
  web3: {
    rpc: envVars.RPC,
  },
  agentRpc: envVars.AGENT_RPC_URL,
};

export const isMainnet = env.network === 'mainnet';
export const isTestnet = env.network === 'testnet';
