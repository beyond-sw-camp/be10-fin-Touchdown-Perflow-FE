import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css';
import axios from "axios";
import {createPinia} from "pinia";

const pinia = createPinia();

const app = createApp(App);
app.mount('#app')

app.use(pinia);