import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Student from '@/components/Student'

Vue.use(Router)

export default new Router({
  mode: 'history',//去除地址栏#号
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/stu',
      name: 'Student',
      component: Student
    }
  ]
})
