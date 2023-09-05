<template>
  <button class="btn btn-primary">
    <i class="fa fa-2xl" :class="icon"/>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'fa-plus',
    }
  },
}
</script>

<style lang="scss" scoped>
button {
  border-radius: 100%;
  border: 0px;
  bottom: 20px;
  height: 80px;
  position: fixed;
  right: 20px;
  width: 80px;

  &:hover {
    background-color: lighten($color: #2c3e50, $amount: 15);
  }
}
</style>