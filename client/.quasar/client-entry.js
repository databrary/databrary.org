/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

import 'quasar/dist/quasar.ie.polyfills.js'



import '@quasar/extras/roboto-font/roboto-font.css'

import '@quasar/extras/material-icons/material-icons.css'




// We load Quasar stylus files
import 'quasar/dist/quasar.styl'


// We add Quasar addons, if they were requested
import 'quasar/src/css/flex-addon.styl'



import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'




import qboot_Bootaxios from 'boot/axios'

import qboot_Bootapollo from 'boot/apollo'












const { app, store, router } = createApp()



async function start () {
  
  const bootFiles = [qboot_Bootaxios,qboot_Bootapollo]
  for (let i = 0; i < bootFiles.length; i++) {
    if (typeof bootFiles[i] !== 'function') {
      continue
    }

    try {
      await bootFiles[i]({
        app,
        router,
        store,
        Vue,
        ssrContext: null
      })
    }
    catch (err) {
      if (err && err.url) {
        window.location.href = err.url
        return
      }

      console.error('[Quasar] boot error:', err)
      return
    }
  }
  

  

    

    

      new Vue(app)

    

  

}

start()
