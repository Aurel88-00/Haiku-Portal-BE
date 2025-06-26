import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserDTO } from 'src/lib/dtos/user.dto';

@Injectable()
export class SignupPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, _metadata: ArgumentMetadata) {
    const errors: string[] = [];
    if (!this.valueHasPassAndConfPass(value)) {
      throw new BadRequestException('Invalid Request Body');
    }
    if (value.password.length < 6) {
      errors.push('password should be at least 6 characters long');
    }

    if (errors.length) {
      throw new BadRequestException(errors.join('\n'));
    }
    return value;
  }
  private valueHasPassAndConfPass(val: unknown): val is UserDTO {
    return typeof val === 'object' && 'password' in (val as UserDTO);
  }
}
