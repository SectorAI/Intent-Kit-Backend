import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  ListedAnalyticResponse,
  PairsResponse,
  TotalTxsAndVolume,
} from './response-example';
import { SUI_ADDRESS } from 'src/utils/constant';
import { env } from 'src/config';

export class DexScreenerService {
  private readonly dexScreenerApiClient: AxiosInstance;
  private readonly logger = new Logger(DexScreenerService.name);

  constructor() {
    this.dexScreenerApiClient = axios.create({
      baseURL: `https://api.dexscreener.com/`,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  public async getThePriceOfSui() {
    try {
      const { data } = await this.dexScreenerApiClient.get<PairsResponse>(
        `latest/dex/tokens/${SUI_ADDRESS}`,
      );

      const suiPairs = data.pairs.filter(
        (pair) =>
          pair.chainId === 'sui' &&
          pair.baseToken.address === SUI_ADDRESS &&
          pair.quoteToken.symbol === 'USDC',
      );

      const sortedPairs = suiPairs.sort(
        (a, b) => b.liquidity.base - a.liquidity.base,
      );
      const usdPair = sortedPairs[0];

      if (!usdPair) throw new Error('Not found sui price!');

      return usdPair.priceNative.toString();
    } catch (err) {
      this.logger.error(JSON.stringify(err as Error));
      return '0';
    }
  }

  public async getDexScreenerPairUrl(funAddress: string) {
    const { data: pairsResponse } =
      await this.dexScreenerApiClient.get<PairsResponse>(
        `latest/dex/tokens/${funAddress}`,
      );

    if (!pairsResponse) return null;

    if (!pairsResponse.pairs) return null;

    const suiPairs = pairsResponse.pairs.filter(
      (pair) =>
        pair.chainId === 'sui' &&
        pair.quoteToken.address === SUI_ADDRESS &&
        pair.baseToken.address === funAddress,
    );

    const sortedPairs = suiPairs.sort(
      (a, b) => b.liquidity.quote - a.liquidity.quote,
    );

    if (!sortedPairs.length) return null;
    const highestLiquidPair = sortedPairs[0];
    const condition =
      env.env === 'production' ? highestLiquidPair.liquidity.quote > 50 : true;
    return condition ? highestLiquidPair.url : null;
  }

  public async getAnalyticPair(funAddress: string, pairUrl: string) {
    const { data: pairsResponse } =
      await this.dexScreenerApiClient.get<PairsResponse>(
        `latest/dex/tokens/${funAddress}`,
      );

    if (!pairsResponse) return null;

    if (!pairsResponse.pairs) return null;

    const suiPair = pairsResponse.pairs.find((pair) => pair.url === pairUrl);

    return {
      priceBySUI: suiPair.priceNative ?? '0',
      priceByUSD: suiPair.priceUsd ?? '0',
      liquidity: suiPair.liquidity.usd.toString() ?? '0',
      volume24hs: suiPair.volume.h24.toString() ?? '0',
      priceChange: suiPair.priceChange ?? {
        h24: '0',
        h6: '0',
        h1: '0',
        m5: '0',
      },
    } as ListedAnalyticResponse;
  }

  public async getTotalTxAndVolume5m(funAddress: string, pairUrl: string) {
    const { data: pairsResponse } =
      await this.dexScreenerApiClient.get<PairsResponse>(
        `latest/dex/tokens/${funAddress}`,
      );

    if (!pairsResponse) return null;

    if (!pairsResponse.pairs) return null;

    const suiPair = pairsResponse.pairs.find((pair) => pair.url === pairUrl);
    return {
      totalTransaction: suiPair.txns.m5.buys + suiPair.txns.m5.sells,
      totalVolume: suiPair.volume.m5,
    } as TotalTxsAndVolume;
  }

  public async getTotalTxAndVolume24h(funAddress: string, pairUrl: string) {
    const { data: pairsResponse } =
      await this.dexScreenerApiClient.get<PairsResponse>(
        `latest/dex/tokens/${funAddress}`,
      );

    if (!pairsResponse) return null;

    if (!pairsResponse.pairs) return null;

    const suiPair = pairsResponse.pairs.find((pair) => pair.url === pairUrl);
    return {
      totalTransaction: suiPair.txns.h24.buys + suiPair.txns.h24.sells,
      totalVolume: suiPair.volume.h24,
    } as TotalTxsAndVolume;
  }
}

export const dexScreenerService = new DexScreenerService();
