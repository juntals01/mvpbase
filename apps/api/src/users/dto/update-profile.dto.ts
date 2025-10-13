import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string | null;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'picture must be a valid URL' })
  @MaxLength(2048)
  picture?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  phoneNumber?: string | null;
}
