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

app.config.errorHandler = (err, vm, info) => {
  console.log("Error ",err)  

  console.log("component ",vm)

  console.log("info",info)
  
  // err: error trace

  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  
  // TODO: Perform any custom logic or log to server

};

import UITools from '@/components/UITools.vue'
import ObjectEditor from '@/components/ObjectEditor.vue'
import ObjectEditorDialog from '@/components/ObjectEditorDialog.vue'
import ObjectContentEditor from '@/components/ObjectContentEditor.vue'

app.component('UITools', UITools)
app.component('ObjectEditor', ObjectEditor)
app.component('ObjectEditorDialog', ObjectEditorDialog)
app.component('ObjectContentEditor', ObjectContentEditor)

app.mount('#app');

