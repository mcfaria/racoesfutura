// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store';

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created(){
    firebase.initializeApp({
      apiKey: 'AIzaSyDRxdqkLA2RI2stu3c47b6UoDaKikFUCFE',
      authDomain: 'futura-952cb.firebaseapp.com',
      databaseURL: 'https://futura-952cb.firebaseio.com',
      projectId: 'futura-952cb',
      storageBucket: 'futura-952cb.appspot.com',
      messagingSenderId: '1058902286056'
    });
    this.$store.dispatch('carregarClientes');
    this.$store.dispatch('carregarProdutos');
  }
})
