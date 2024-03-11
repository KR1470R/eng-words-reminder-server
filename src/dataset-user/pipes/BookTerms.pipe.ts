import { PipeTransform } from '@nestjs/common';
import BookTermsDto from '../dto/BookTerms.dto';

export default class BookTermsPipe implements PipeTransform {
  transform(value: BookTermsDto) {
    if (value.amount) {
      value.amount = Number(value.amount);
    }
    if (value.repeat) {
      value.repeat = Boolean(value.repeat);
    }
    return value;
  }
}
