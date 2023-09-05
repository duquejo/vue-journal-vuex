export default {
  name: 'daybook',
  component: () => import(/* webpackChunkName: "daybook" */ '@/modules/daybook/layouts/DaybookLayout'),
  children: [
    {
      path: '',
      name: 'no-entry',
      component: () => import(/* webpackChunkName: "daybook-no-entry" */ '@/modules/daybook/views/NoEntrySelectedView'),
    },
    {
      path: ':id',
      name: 'entry',
      component: () => import(/* webpackChunkName: "daybook-no-entry" */ '@/modules/daybook/views/EntryView'),
    },

  ]
}