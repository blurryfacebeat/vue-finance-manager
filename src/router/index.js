import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase/app';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // Чтобы знать, какой layout они должны использовать
    meta: {layout: 'empty'},
    component: () => import('../views/Login.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    meta: {layout: 'empty'},
    component: () => import('../views/Registration.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/detail-record/:recordId',
    name: 'DetailRecord',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/DetailRecord.vue')
  },
  {
    path: '/history',
    name: 'History',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/History.vue')
  },
  {
    path: '/planning',
    name: 'Planning',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Planning.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/record',
    name: 'Record',
    meta: {layout: 'main', auth: true},
    component: () => import('../views/Record.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Вызывается перед каждой сменой роута
router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requireAuth = to.matched.some(record => record.meta.auth);

  // Запрещаем пользователю без авторизации открывать некоторые страницы
  if (requireAuth && !currentUser) {
    next('/login?message=login');
  } else {
    // Если все нормально, просто переходитм на страницу
    next();
  }
});

export default router
