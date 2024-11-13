import { Injectable } from '@nestjs/common';

@Injectable()
export class UilocalizeService {
  getHello(): string {
    return 'Hello World!';
  }
}
