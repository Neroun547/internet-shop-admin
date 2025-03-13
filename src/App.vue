<template>
  <v-app>
    <SideNavBar />
    <router-view />
  </v-app>
</template>
<script setup>
  import "./styles/main.css";
  import SideNavBar from "@/components/SideNavBar.vue";
</script>
