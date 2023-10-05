export default {
  name: 'auth',
  component: () => import(/* webpackChunkName: "Auth" */ '@/modules/auth/layouts/AuthLayout'),
  children: [
    {
      path: '',
      name: 'login',
      component: () => import(/* webpackChunkName: "Login" */ '@/modules/auth/views/LoginView'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "Register" */ '@/modules/auth/views/RegisterView'),
    },
  ]
}