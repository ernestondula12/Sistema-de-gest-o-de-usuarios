import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView'
import UsersView from '../views/UsersView'
import EditView from '../views/EditView'
import axios from 'axios'

function AdminAuth(to, from, next){ 
  if(localStorage.getItem('token') != undefined){

    var req = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
    }
    axios.post("http://localhost:8686/validate",{},req).then(res => {
      console.log(res);
      next();
    }).catch(err => {
        console.log(err.response);
        next("/login");
    })
}else{
  next("/login");
}

}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin/users',
    name: 'users',
    component: UsersView,
    beforeEnter: AdminAuth
  },
  {
    path: '/admin/users/edit/:id',
    name: 'userEdit',
    component: EditView,
    beforeEnter: AdminAuth
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
