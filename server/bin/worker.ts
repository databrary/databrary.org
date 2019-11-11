import worker from '../src/queue/worker'

async function main () {
  await worker()
}

// tslint:disable-next-line: no-floating-promises
main()
