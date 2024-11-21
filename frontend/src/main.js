import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/tailwind.css';

const app = createApp(App);
app.config.performance = true;
app.use(router);
app.config.devtools = false;

app.mount("#app");

