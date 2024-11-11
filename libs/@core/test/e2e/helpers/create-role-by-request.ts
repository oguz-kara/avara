import { INestApplication } from '@nestjs/common'

export const createRoleByRequest = async (
  request: any,
  app: INestApplication,
) => {
  const createRoleMutation = `
    mutation {
        createRole(input: { name: "test_role" }) {
            id
            name
        }
    }
`
  const roleResponse = await request(app.getHttpServer())
    .post('/protected')
    .send({ query: createRoleMutation })

  return roleResponse.body.data.createRole
}
