import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class TwitterCallbackDto {
  @IsString()
  @ApiProperty({ example: 'key' })
  oauth_token: string;

  @IsString()
  @ApiProperty({ example: 'key' })
  oauth_verifier: string;

  get oauthToken() {
    return this.oauth_token;
  }

  get oauthVerifier() {
    return this.oauth_verifier;
  }
}

export class TwitterGetAuthUrlDto {
  @IsUrl({
    require_tld: false,
  })
  @IsOptional()
  @ApiProperty({ required: false })
  callbackUrl?: string;

  @ApiProperty({
    type: String,
    description: 'the wallet address',
    example: '0x12312312',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class TwitterAuthUrlResponseDto {
  @ApiResponseProperty({ example: 'https://api.x.com/oauth/authorize' })
  url: string;
}
