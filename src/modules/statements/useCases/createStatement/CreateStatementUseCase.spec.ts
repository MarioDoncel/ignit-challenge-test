import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


describe('Create Statement', () => {
  let createStatementUseCase: CreateStatementUseCase
  let statementsRepositoryInMemory: IStatementsRepository
  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })
  it('should be able to create a new deposit statement', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    expect(statement).toHaveProperty('id')
  })
  it('should be able to create a new withdraw statement', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: 'any_description'
    })
    expect(statement).toHaveProperty('id')
  })
  it('should not be able to create a new statement with a non-existent user', async () => {
    await expect(createStatementUseCase.execute({
      user_id: 'non-existent-user',
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })
  it('should not be able to create a new withdraw statement with insufficient funds', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await expect(createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: 'any_description'
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
