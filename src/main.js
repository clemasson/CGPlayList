import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'vuetify/styles'

import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import "@mdi/font/css/materialdesignicons.css";
import "@fortawesome/fontawesome-free/css/all.css";

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App);

app.use(vuetify);
app.use(router);

import ObjectEditor from '@/components/ObjectEditor.vue'
import ObjectContentEditor from '@/components/ObjectContentEditor.vue'

app.component('ObjectEditor', ObjectEditor)
app.component('ObjectContentEditor', ObjectContentEditor)

app.mount('#app');

