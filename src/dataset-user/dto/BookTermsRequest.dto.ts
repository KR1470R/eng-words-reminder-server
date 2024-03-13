import {
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class BookTermsRequestDto {
  /**
   * Amount of desirable terms server should return.
   * Note that it's recommended and enforced to not to use big value, for example no more than 10.
   * This value can be ignored due to the server can use the default value.
   */
  @ApiProperty({
    name: 'amount',
    default: 1,
    required: false,
    description:
      "Amount of desirable terms server should return. Note that it's recommended and enforced to not to use big value, for example no more than 10. This value can be ignored due to the server can use the default value.",
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount?: number;

  /**
   * In case when user already booked all terms, the server will throw an error about that,
   * to skip this error and clear user progress - set to true.
   * @deprecated Please note, that this parameter may be removed in the future.
   */
  @ApiProperty({
    name: 'repeat',
    deprecated: true,
    required: false,
    description:
      'In case when user already booked all terms, the server will throw an error about that, to skip this error and clear user progress - set to true.  Please note, that this parameter may be removed in the future.',
  })
  @IsOptional()
  @IsBoolean()
  repeat?: boolean;

  /**
   * Server has limit for the amount parameter, so if you try to pass amount value,
   * that will be larger than this limit, you'll get the error.
   * With this parameter the server will ignore the server limit.
   * WARNING: this parameter should be used only for testing.
   * @deprecated Please note, that this parameter may be removed in the future.
   */
  @ApiProperty({
    name: 'ignoreLimit',
    deprecated: true,
    required: false,
    description:
      'Server has limit for the amount parameter, so if you try to pass amount value, that will be larger than this limit, you will get the error. With this parameter the server will ignore the server limit. WARNING: this parameter should be used only for testing. Please note, that this parameter may be removed in the future.',
  })
  @IsOptional()
  @IsBoolean()
  ignoreLimit?: boolean;
}
