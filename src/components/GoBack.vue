<template>
  <v-icon icon="mdi-arrow-left" class="cursor-pointer" @click="goBack"></v-icon>
</template>
<script>
export default {
  props: {
    goBackUrl: {
      required: false,
      type: String
    }
  },
  methods: {
    goBack() {
      if(this.goBackUrl) {
        window.location.href = this.goBackUrl;
      } else {
        const str = window.location.href;
        window.location.href = str.substring(0, str.lastIndexOf("/"));
      }
    }
  }
}
</script>
<style scoped>

</style>
