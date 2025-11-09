import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { ChatMessage } from 'src/types/chat.types';

export class ChatDto {
  @IsString()
  @Length(1, 256)
  message: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      throw new BadRequestException('failed to parse history');
    }
  })
  history?: ChatMessage[];
}
