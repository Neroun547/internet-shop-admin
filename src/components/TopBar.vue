<template>
    <v-app-bar class="bg-white" v-if="isAuthenticated">
      <v-app-bar-nav-icon
        variant="text"
        @click="isNavOpen = !isNavOpen"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <SideNavBar :is-nav-open="isNavOpen" />
</template>
<script setup>
import { onMounted } from "vue";
import useUserStore from "../stores/user.js";
import SideNavBar from "./SideNavBar.vue";

const isAuthenticated = ref(false);
const isNavOpen = ref(false);

onMounted(() => {
  const store = useUserStore();

  isAuthenticated.value = store.getIsAuthenticated;
});
</script>
