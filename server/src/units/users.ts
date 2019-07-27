export async function createUser( options: any ) {
  const [userId] = await options.knex('users')
    .returning('id')
    .insert({
      fullName: options.fullName,
    })
  return userId
}