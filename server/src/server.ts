import app from './app'
import { logger } from './shared'
import { setup as queueSetup } from './queue'

async function main () {
  try {
    await queueSetup()

    app.listen({ port: process.env.SERVER_PORT }, () =>
      logger.info(`Server is running at http://localhost:${process.env.SERVER_PORT } in ${app.get('env')} mode`)
    )
  } catch (err) {
    logger.error(err)
  }
}

// tslint:disable-next-line: no-floating-promises
main()
