import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"

import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


describe('Get Balance', () => {
  let getStatementOperationUseCase: GetStatementOperationUseCase
  let statementsRepositoryInMemory: IStatementsRepository
  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
  })
  it('should be able to get statement operation', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'any_description'
    })
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    })
    expect(statementOperation).toHaveProperty('id')
  })
  it('should not be able to get statement operation with a non-existent user', async () => {
    await expect(getStatementOperationUseCase.execute({
      user_id: 'non-existent-user',
      statement_id: 'any_statement_id'
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)

  })

  it('should not be able to get statement operation with a non-existent statement', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    await expect(getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: 'non-existent-statement'
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
