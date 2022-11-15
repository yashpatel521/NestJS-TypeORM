import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { fileUploadType } from "../common.constants";

export class fileUploadDto {
  @ApiProperty({ required: false, example: "user" })
  @IsString()
  @IsOptional()
  type: fileUploadType;

  @ApiProperty({ required: false, example: 1 })
  @IsString()
  @IsOptional()
  userId: fileUploadType;
}
