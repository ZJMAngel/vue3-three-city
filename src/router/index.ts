import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/city',
  },
  {
    path: '/city',
    name: 'ctiy',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/CityView.vue'),
  },
  {
    path: '/park',
    name: 'park',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/ParkView.vue'),
  },
  {
    path: '/factory',
    name: 'factory',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/FactoryView.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
