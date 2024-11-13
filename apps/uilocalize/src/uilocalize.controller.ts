import { Controller, Get } from '@nestjs/common';
import { UilocalizeService } from './uilocalize.service';

@Controller()
export class UilocalizeController {
  constructor(private readonly uilocalizeService: UilocalizeService) {}

  @Get()
  getHello(): string {
    return this.uilocalizeService.getHello();
  }
}
