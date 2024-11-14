import { PermissionString } from '@avara/core/domain/user/api/types/permission.types'
import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/domain/user/application/enums'
import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'

@InputType()
export class CreatePermissionDto {
  @Field({ nullable: true })
  @IsString()
  specific_scope_id?: string

  @Field(() => ActionType)
  @IsEnum(ActionType)
  action: ActionType

  @Field(() => ResourceType)
  @IsEnum(ResourceType)
  resource: ResourceType

  @Field(() => ScopeType)
  @IsEnum(ScopeType)
  scope: ScopeType
}

@InputType()
export class UpdatePermissionDto {
  @Field({ nullable: true })
  @IsString()
  specific_scope_id?: string

  @Field(() => ActionType, { nullable: true })
  @IsEnum(ActionType)
  action?: ActionType

  @Field(() => ResourceType, { nullable: true })
  @IsEnum(ResourceType)
  resource?: ResourceType

  @Field(() => ScopeType, { nullable: true })
  @IsEnum(ScopeType)
  scope?: ScopeType
}

@InputType()
export class RenamePermissionDto {
  @Field()
  @IsString()
  id: string

  @Field(() => String)
  @IsString()
  name: PermissionString
}
