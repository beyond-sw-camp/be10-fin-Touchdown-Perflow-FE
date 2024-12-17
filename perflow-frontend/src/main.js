import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css';
import router from './router/router.js'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount('#app')
