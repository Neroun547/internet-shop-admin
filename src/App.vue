<template>
  <v-app>
    <SideNavBar />
    <div class="wrapper__page">
      <router-view />
    </div>
  </v-app>
</template>
<script setup>
  import "./styles/main.css";
  import SideNavBar from "@/components/SideNavBar.vue";
  import GoBack from "@/components/GoBack.vue";
</script>
<style scoped>
  .wrapper__page {
    margin-top: 75px;
  }
</style>
