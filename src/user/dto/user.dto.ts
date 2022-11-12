import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateUser {
  id: number;

  @ApiProperty({ required: true, example: 'Yash Patel' })
  name: string;

  @ApiProperty({ required: true, example: 'yash@yash.com' })
  email: string;

  @ApiProperty({ required: true, example: 'yash@yash' })
  password: string;
}

export class UpdateUser {
  @ApiProperty({ required: true })
  @IsInt()
  id: number;

  @ApiProperty({ required: false, example: 'Yash Patel' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'yash@yash.com' })
  email: string;

  @ApiProperty({ required: true, example: 'yash@yash' })
  @IsString()
  password: string;
}
