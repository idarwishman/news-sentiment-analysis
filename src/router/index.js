import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Playpen from '@/components/Playpen'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/about',
      name: 'About',
      component: About
    }, {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/play',
      name: 'Playpen',
      component: Playpen
    }
  ]
})
