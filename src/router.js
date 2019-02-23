import Vue from 'vue'
import Router from 'vue-router'
import Movies from './components/Movies.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'movies',
      component: Movies
    },
    {
      path: '/tv',
      name: 'tv',
      // route level code-splitting
      // this generates a separate chunk (tv.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "tv" */ './components/Tv.vue')
    }

  ]
})
