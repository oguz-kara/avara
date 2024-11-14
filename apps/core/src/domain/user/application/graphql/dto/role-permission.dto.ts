import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType()
export class CreateRolePermissionDto {
  @Field()
  @IsString()
  role_id: string

  @Field()
  @IsString()
  permission_id: string

  @Field()
  @IsBoolean()
  is_active: boolean
}

@InputType()
export class UpdateRolePermissionDto {
  @Field({ nullable: true })
  @IsString()
  role_id?: string

  @Field({ nullable: true })
  @IsString()
  permission_id?: string

  @Field()
  @IsBoolean()
  is_active: string
}
