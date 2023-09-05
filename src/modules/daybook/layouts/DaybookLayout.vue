<template>
  <NavbarComponent />
  <div class="d-flex">
    <div class="col-4">
      <EntryListComponent />
    </div>
    <div class="col">
      <router-view />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    NavbarComponent: defineAsyncComponent(() => import('../components/NavbarComponent.vue')),
    EntryListComponent: defineAsyncComponent(() => import('../components/EntryListComponent.vue')),
  },
}
</script>