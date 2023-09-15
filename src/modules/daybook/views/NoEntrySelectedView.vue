<template>
  <div class="d-flex justify-content-center">
    <h1 class="align-self-center">There is nothing selected</h1>
  </div>
  <FabComponent 
    @on:click="goToCreateEntry"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'NoEntrySelectedView',
  methods: {
    goToCreateEntry() {
      this.$router.push({ name: 'entry', params: { id: 'new' } });
    },
  },
  components: { 
    FabComponent: defineAsyncComponent(() => import('../components/FabComponent')),
  }
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
}
</style>