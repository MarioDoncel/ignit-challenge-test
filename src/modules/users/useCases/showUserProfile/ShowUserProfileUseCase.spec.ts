import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"





describe('Show User Profile', () => {

  let showUserProfileUseCase: ShowUserProfileUseCase

  let usersRepositoryInMemory: IUsersRepository
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
  })
  it('should be able to show a user profile', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User Test',
      email: 'any_email',
      password: 'any_password'
    })
    const user_id = user.id as string
    const user_profile = await showUserProfileUseCase.execute(user_id)
    expect(user_profile).toHaveProperty('id')
  })

  it('should not be able to show a user profile with a non-existing user', async () => {
    await expect(showUserProfileUseCase.execute('non_existing_user_id')).rejects.toBeInstanceOf(ShowUserProfileError)
  })


})
