import {
  IsOptional,
  IsNotEmpty,
  IsPositive,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export default class BookTermsDto {
  /**
   * Amount of desirable terms server should return.
   * Note that it's recommended and enforced to not to use big value, for example no more than 10.
   * This value can be ignored due to the server can use the default value.
   */
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
  @IsOptional()
  @IsBoolean()
  ignoreLimit?: boolean;
}
