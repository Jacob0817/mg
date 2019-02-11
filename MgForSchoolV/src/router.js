import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Class1 from './views/class1.vue'
import Class2 from './views/class2.vue'
import Class3 from './views/class3.vue'
import Class4 from './views/class4.vue'
import Class5 from './views/class5.vue'
import Class6 from './views/class6.vue'
import Class7 from './views/class7.vue'
import Class8 from './views/class8.vue'
import Class9 from './views/class9.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/class1',
      name: 'class1',
      components: {
        classPanel : Class1
      },
      
    },
    {
      path: '/class2',
      name: 'class2',
      components: {
        classPanel : Class2
      },
      
    },
    {
      path: '/class3',
      name: 'class3',
      components: {
        classPanel : Class3
      },
      
    },
    {
      path: '/class4',
      name: 'class4',
      components: {
        classPanel : Class4
      },
      
    },
    {
      path: '/class5',
      name: 'class5',
      components: {
        classPanel : Class5
      },
      
    },
    {
      path: '/class6',
      name: 'class6',
      components: {
        classPanel : Class6
      },
      
    },
    {
      path: '/class7',
      name: 'class7',
      components: {
        classPanel : Class7
      },
      
    },
    {
      path: '/class8',
      name: 'class8',
      components: {
        classPanel : Class8
      },
      
    },
    {
      path: '/class9',
      name: 'class9',
      components: {
        classPanel : Class9
      },
      
    },
    
  ]
})
