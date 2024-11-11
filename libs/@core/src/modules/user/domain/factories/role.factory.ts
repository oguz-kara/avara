import { RequestContext } from '@avara/core/context/request-context'
import { Role } from '../entities/role.entity'
import { Permission } from '../entities/permission.entity'

interface RoleInput {
  name: string
  permissions?: Permission[]
}

export class RoleFactory {
  static createRole(input: RoleInput, ctx: RequestContext): Role {
    return new Role({
      id: undefined,
      name: input.name,
      permissions: [],
      channels: [ctx.channel],
    })
  }
}
