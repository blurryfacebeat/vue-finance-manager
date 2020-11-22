import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';
import VueMeta from 'vue-meta';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
// Регистрируем глобальный фильтр
import localizeFilter from '@/filters/localize.filter';
import dateFilter from '@/filters/date.filter';
import currencyFilter from '@/filters/currency.filter';
import tooltipDirective from '@/directives/tooltip.directive';
import messagePlugin from '@/utils/message.plugin';
import titlePlugin from '@/utils/title.plugin';
import Loader from '@/components/app/Loader';
import 'materialize-css/dist/js/materialize.min';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false

// Глобально регистрирую компонент
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.use(VueMeta);

// Регистрируем глобальный фильтр
Vue.filter('localize', localizeFilter);
Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);

// Регистрируем директиву
Vue.directive('tooltip', tooltipDirective);

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9JlCvy3vpexc5YaxQ8X1wqn-C8-P2SgQ",
  authDomain: "finance-manager-vue.firebaseapp.com",
  databaseURL: "https://finance-manager-vue.firebaseio.com",
  projectId: "finance-manager-vue",
  storageBucket: "finance-manager-vue.appspot.com",
  messagingSenderId: "904076378558",
  appId: "1:904076378558:web:3e8131d5ef0363f964b9ef"
};

firebase.initializeApp(firebaseConfig);

// Проверка, инициализированно ли уже приложение, чтобы не создавать его много раз при пножественных логинах и выходах
let app;

// Будет вызываться, когда firebase найдет какие-то локальные данные пользователя, которые будут поддерживать
// Атоматическую авторизацию
// Вызываем vue-приложение только тогда, когда авторизованы
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
});