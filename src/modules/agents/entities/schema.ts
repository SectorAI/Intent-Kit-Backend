export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export enum ModelProviderName {
  OPENAI = 'openai',
  ETERNALAI = 'eternalai',
  ANTHROPIC = 'anthropic',
  GROK = 'grok',
  GROQ = 'groq',
  LLAMACLOUD = 'llama_cloud',
  TOGETHER = 'together',
  LLAMALOCAL = 'llama_local',
  GOOGLE = 'google',
  CLAUDE_VERTEX = 'claude_vertex',
  REDPILL = 'redpill',
  OPENROUTER = 'openrouter',
  OLLAMA = 'ollama',
  HEURIST = 'heurist',
  GALADRIEL = 'galadriel',
  FAL = 'falai',
  GAIANET = 'gaianet',
  ALI_BAILIAN = 'ali_bailian',
  VOLENGINE = 'volengine',
  NANOGPT = 'nanogpt',
  HYPERBOLIC = 'hyperbolic',
  VENICE = 'venice',
  AKASH_CHAT_API = 'akash_chat_api',
}

export enum Clients {
  DISCORD = 'discord',
  DIRECT = 'direct',
  TWITTER = 'twitter',
  TELEGRAM = 'telegram',
  FARCASTER = 'farcaster',
  LENS = 'lens',
  AUTO = 'auto',
  SLACK = 'slack',
}

export interface MessageExample {
  /** Associated user */
  user: string;
  /** Message content */
  content: Content;
}

export interface Content {
  /** The main text content */
  text: string;
  /** Optional action associated with the message */
  action?: string;
  /** Optional source/origin of the content */
  source?: string;
  /** URL of the original message/post (e.g. tweet URL, Discord message link) */
  url?: string;
  /** UUID of parent message if this is a reply/thread */
  inReplyTo?: UUID;
  /** Array of media attachments */
  attachments?: Media[];
  /** Additional dynamic properties */
  [key: string]: unknown;
}

export type Media = {
  /** Unique identifier */
  id: string;
  /** Media URL */
  url: string;
  /** Media title */
  title: string;
  /** Media source */
  source: string;
  /** Media description */
  description: string;
  /** Text content */
  text: string;
  /** Content type */
  contentType?: string;
};