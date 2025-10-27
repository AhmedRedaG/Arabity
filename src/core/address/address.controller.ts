import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';

@UseGuards(AuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@User('sub') userId: string, @Body() dto: CreateAddressDto) {
    return this.addressService.create(userId, dto);
  }

  @Get()
  findAll(@User('sub') userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) addressId: string,
  ) {
    return this.addressService.findOne(userId, addressId);
  }

  @Patch(':id')
  update(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressService.update(userId, addressId, updateAddressDto);
  }

  @Delete(':id')
  remove(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) addressId: string,
  ) {
    return this.addressService.remove(userId, addressId);
  }
}
