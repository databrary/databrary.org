const { sh, cli } = require('tasksfile')
const _ = require('lodash')

const silent = { silent: true }

let docker_host_ip = 'host.docker.internal'
const uname = _.trim(sh('echo hi && uname -s', silent))
if(uname === 'Linux' && process.env.WSL === 0) {
  docker_host_ip = sh('ip -4 addr show docker0 | grep -Po \'inet \K[\d.]+\'', silent)
}

function info() {
  console.log(`uname: ${uname}`)
  console.log(`wsl: ${process.env.WSL}`)
  console.log(`docker host ip: ${docker_host_ip}`)
}

function install_js_packages() {
  const paths = ['./server', './client']
  _.forEach(paths, function(cwd) {
    sh('yarn', { cwd })
  })
}

function setup_migrations() {
  sh('hasura migrate apply', {
    cwd: 'hasura'
  })
}

cli({
  info,
  install_js_packages
})