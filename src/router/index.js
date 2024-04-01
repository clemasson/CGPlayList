import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL + 'index.html'),
  //history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'test',
      path: '/test',
      component: () => import(/* webpackChunkName: "test" */ '../Test.vue'),
    },
    {
      name: 'cgtest',
      path: '/cgtest',
      component: () => import(/* webpackChunkName: "cgtest" */ '../CGTest.vue'),
    },
    {
      name: 'playlisteditor',
      path: '/playlist/:layout/playlist/:playlist/edit',
      component: () => import(/* webpackChunkName: "editor" */ '../PlayListEditor.vue'),
    },
    {
      path: '',
      redirect: '/test',
    },
    
  ],
});

export default router;
