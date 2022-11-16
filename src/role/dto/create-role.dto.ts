export class CreateRoleDto {
  // @example 'admin'
  name: string;
}

/**  
 import { ApiProperty } from "@nestjs/swagger";
 import { IsString } from "class-validator";
 
 export class CreateRoleDto {
   @ApiProperty({ required: true, example: "admin" })
   @IsString()
   name: string;
  }
*/
