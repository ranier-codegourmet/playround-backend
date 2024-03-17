import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string) {
    const isValid = Types.ObjectId.isValid(value);

    if (!isValid) {
      throw new BadRequestException('Invalid Id');
    }

    return value;
  }
}
