import app from './app'
import { logger } from '@shared'
import { setup as queueSetup } from './queue'

async function main () {
  try {
    await queueSetup()

    app.listen({ port: process.env.APP_PORT }, () =>
            logger.info(`Server is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)
        )
  } catch (err) {
    logger.error(err)
  }
}

// tslint:disable-next-line: no-floating-promises
main()
