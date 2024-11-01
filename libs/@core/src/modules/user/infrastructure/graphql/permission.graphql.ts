import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { PaginatedResponseMeta } from '@avara/shared/graphql/pagination-response.graphql'
import { PermissionString } from '../../api/types/permission.types'

@ObjectType()
export class Permission {
  @Field()
  @IsString()
  id: string

  @Field({ nullable: true })
  @IsString()
  specific_scope_id?: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  action: string

  @Field()
  @IsString()
  resource: string

  @Field()
  @IsString()
  scope: string

  @Field({ nullable: true })
  @IsString()
  created_by?: string

  @Field({ nullable: true })
  @IsString()
  updated_by?: string

  @Field({ nullable: true })
  created_at: Date

  @Field({ nullable: true })
  updated_at: Date

  @Field({ nullable: true })
  deleted_at: Date

  isTypeOf(value: any) {
    return value instanceof Permission
  }
}

// Define the paginated response for roles
@ObjectType()
export class FindPermissionsResponseType {
  @Field(() => [Permission])
  items: Permission[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}

@InputType()
export class FindPermissionByNameInput {
  @Field(() => String)
  @IsString()
  name: PermissionString
}

@InputType()
export class AssignSpecificScopeIdInput {
  @Field()
  @IsString()
  permissionId: string

  @Field()
  @IsString()
  specificScopeId: string
}
