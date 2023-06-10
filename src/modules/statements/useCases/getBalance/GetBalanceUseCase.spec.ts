import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


describe('Get Balance', () => {
  let getBalanceUseCase: GetBalanceUseCase
  let statementsRepositoryInMemory: IStatementsRepository
  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
  })
  it('should be able to get balance', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })
    expect(balance).toHaveProperty('balance')
  })
  it('should not be able to get balance with a non-existent user', async () => {
    await expect(getBalanceUseCase.execute({
      user_id: 'non-existent-user'
    })).rejects.toBeInstanceOf(GetBalanceError)
  })
  it('should get correct balance after a deposit', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })
    expect(balance.balance).toBe(100)
  })
  it('should get correct balance after a withdraw', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: 'any_description'
    })
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })
    expect(balance.balance).toBe(50)
  }
  )
  it('should get correct balance after a deposit and withdraw', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })

    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: 'any_description',
    })
    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    })
    expect(balance.balance).toBe(50)
  })
})
