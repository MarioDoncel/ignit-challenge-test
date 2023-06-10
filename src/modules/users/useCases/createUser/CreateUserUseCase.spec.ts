import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { CreateUserError } from "./CreateUserError"





describe('Create User', () => {

  let createUserUseCase: CreateUserUseCase

  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })
  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with an existing email', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await expect(createUserUseCase.execute({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })).rejects.toBeInstanceOf(CreateUserError)
  })


})
