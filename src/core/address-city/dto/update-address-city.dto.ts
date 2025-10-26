import { PartialType } from '@nestjs/mapped-types';
import { CreateAddressCityDto } from './create-address-city.dto';

export class UpdateAddressCityDto extends PartialType(CreateAddressCityDto) {}
