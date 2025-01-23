import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { env } from 'src/config';
const path = require('path');

@Injectable()
export class AgentManagerService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  onModuleInit() {
    // Define the path to the proto file
    const PROTO_PATH = path.resolve(
      __dirname,
      '../../proto/agent_manager.proto',
    );

    console.log(PROTO_PATH);

    // Load the proto file
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    // Get the service definition
    const protoDescriptor = grpc.loadPackageDefinition(
      packageDefinition,
    ) as any;
    const AgentManager = protoDescriptor.AgentManager;

    // Initialize the gRPC client
    this.client = new AgentManager(
      env.agentRpc,
      grpc.credentials.createInsecure(),
    );
  }

  onModuleDestroy() {
    if (this.client && this.client.close) {
      this.client.close();
    }
  }

  async startAgent(
    character: string,
    twitter: { username: string; token: string; secret: string },
  ): Promise<any> {
    const request = { character, twitter };

    return new Promise((resolve, reject) => {
      this.client.StartAgent(
        request,
        (err: grpc.ServiceError | null, response: any) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        },
      );
    });
  }

  async stopAgent(pid: string): Promise<any> {
    const request = { pid };

    return new Promise((resolve, reject) => {
      this.client.StopAgent(
        request,
        (err: grpc.ServiceError | null, response: any) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        },
      );
    });
  }

  async getAgentStatus(pid: string): Promise<any> {
    const request = { pid };

    return new Promise((resolve, reject) => {
      this.client.GetAgentStatus(
        request,
        (err: grpc.ServiceError | null, response: any) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        },
      );
    });
  }

  async simulateAgent(
    character: string,
    action: number,

    tweet?: string,
  ): Promise<any> {
    const request = { character, tweet, action };

    return new Promise((resolve, reject) => {
      this.client.SimulateAgent(
        request,
        (err: grpc.ServiceError | null, response: any) => {
          if (err) {
            return reject(err);
          }
          resolve(response);
        },
      );
    });
  }
}
