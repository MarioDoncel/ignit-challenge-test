import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"




describe('Authenticate User', () => {
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase

  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory,)
  })
  it('should be able to authenticate user', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    const userAuthenticated = await authenticateUserUseCase.execute({
      email: 'any_email',
      password: 'any_password'
    })
    expect(userAuthenticated).toHaveProperty('token')
  })

  it('should not be able to authenticate user with a non-existent user', async () => {
    await expect(authenticateUserUseCase.execute({
      email: 'non-existent-email',
      password: 'any_password'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate user with a incorrect password', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await expect(authenticateUserUseCase.execute({
      email: 'any_email',
      password: 'incorrect_password'
    })).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
