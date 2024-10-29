import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
// import Deploy from './Deploy.vue'
import Deploy from '@/Deploy.vue'
import router from './router'

const app = createApp (Deploy)

app.use(createPinia())
app.use(router)

app.mount('#app')
