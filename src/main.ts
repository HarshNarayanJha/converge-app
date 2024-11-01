import "@/assets/index.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire } from "vuefire"

import App from './App.vue'
import router from './router'

import { firebaseApp } from './firebase-config'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueFire, {
  firebaseApp
})

app.mount('#app')
