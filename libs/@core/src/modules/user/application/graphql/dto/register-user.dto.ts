import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { UserActiveStatus } from '../../../domain/enums/user-active-status.enum'

@InputType()
export class RegisterUserDto {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string

  @Field()
  @IsString()
  @IsNotEmpty()
  role_id: string

  @Field(() => UserActiveStatus)
  @IsEnum(UserActiveStatus)
  is_active: UserActiveStatus
}
