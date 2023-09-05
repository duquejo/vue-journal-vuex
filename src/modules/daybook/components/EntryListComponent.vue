<template>
  <div class="entry-list-container">
    <div class="px-2 pt-2">
      <input type="text" class="form-control" placeholder="Search entry" />
    </div>

    <div class="entry-scrollable-area">
      <Entry
        v-for="entry in 100" 
        :key="entry">Entry: {{ entry }}</Entry>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
export default {
  components: {
    Entry: defineAsyncComponent(() => import('./EntryComponent')),
  }
}
</script>

<style lang="scss" scoped>
.entry-list-container {
  border-right: 1px solid #2c3e50;
  height: calc(100vh - 56px);
}
.entry-scrollable-area {
  height: calc(100vh - 110px);
  overflow: scroll;
}
</style>