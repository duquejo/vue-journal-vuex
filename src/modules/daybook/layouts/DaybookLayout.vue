<template>
  <NavbarComponent />
  <div v-if="isLoading" class="row justify-content-md-center">
    <div class="col-3 alert-info text-center mt-5 gap-0">
      Wait a sec...
      <h3 class="mt-2">
        <i class="fa fa-spin fa-sync"></i>
      </h3>
    </div>
  </div>
  <div v-else class="d-flex">
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
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('journal', ['isLoading']),
  },
  methods: {
    ...mapActions('journal', ['loadEntries']),
  },
  created() {
    this.loadEntries();
  },
  components: {
    NavbarComponent: defineAsyncComponent(() => import('../components/NavbarComponent.vue')),
    EntryListComponent: defineAsyncComponent(() => import('../components/EntryListComponent.vue')),
  },
}
</script>