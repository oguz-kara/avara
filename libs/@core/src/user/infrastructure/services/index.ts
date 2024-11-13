import { BcryptHasherService } from './bcryp-hasher.service'
import { PasswordService } from './password.service'

export const UserInfraServices = [BcryptHasherService, PasswordService]
