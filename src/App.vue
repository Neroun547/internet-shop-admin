<template>
  <v-app>
    <v-card style="min-height: 100vh;">
      <v-layout style="min-height: 100vh;">
        <TopBar />
        <v-main class="wrapper__page">
          <router-view />
        </v-main>
      </v-layout>
    </v-card>
  </v-app>
</template>
<script setup>
import "./styles/main.css";
import TopBar from "./components/TopBar.vue";
</script>
<style scoped>
.wrapper__page {
  margin-top: 40px;
}
</style>
