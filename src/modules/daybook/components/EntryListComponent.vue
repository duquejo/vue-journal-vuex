<template>
  <div class="entry-list-container">
    <div class="px-2 pt-2">
      <input v-model="term" type="text" class="form-control" placeholder="Search entry" />
    </div>

    <div class="mt-2 d-flex flex-column">
      <button @click="$router.push({ name: 'entry', params: { id: 'new' } })" 
        class="btn btn-primary mx-2">
        <i class="fa fa-plus-circle"/>
        New entry
      </button>
    </div>

    <div class="entry-scrollable-area">
      <EntryComponent
        v-for="entry in entriesByTerm"
        :key="entry.id"
        :entry="entry"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    EntryComponent: defineAsyncComponent(() => import('./EntryComponent')),
  },
  data() {
    return {
      term: '',
    }
  },
  computed: {
    ...mapGetters('journal', ['getEntriesByTerm']),
    entriesByTerm() {
      return this.getEntriesByTerm( this.term );
    },
  },
}
</script>

<style lang="scss" scoped>
.entry-list-container {
  border-right: 1px solid #c7c8c9;
  height: calc(100vh - 56px);
}
.entry-scrollable-area {
  height: calc(100vh - 110px);
  overflow: scroll;
}
</style>