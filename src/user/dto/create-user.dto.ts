import { MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  // @example 'Admin'
  name: string;

  // @example 'Admin@admin.com'
  email: string;

  // @example 'Admin@123'
  @MinLength(8)
  @MaxLength(20)
  password: string;

  // @example 'public/user/default.png'
  profile?: string;

  // @example 'admin'
  role: string;
}

/**
 import { ApiProperty } from "@nestjs/swagger";
 import { IsOptional, IsString } from "class-validator";
 
 export class CreateUserDto {
   @ApiProperty({ required: true, example: "Yash Patel" })
   @IsString()
  name: string;
  
  @ApiProperty({ required: true, example: "yash@yash.com" })
  @IsString()
  email: string;
  
  @ApiProperty({ required: true, example: "Yash@1234" })
  @IsString()
  password: string;

  @IsOptional()
  profile: string;

  @ApiProperty({ required: true, example: "admin" })
  @IsString()
  role: string;
}
*/
