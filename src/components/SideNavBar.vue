<template>
  <v-navigation-drawer
    v-model="props.isNavOpen"
    class="bg-yellow-accent-4"
    temporary
  >
    <v-list density="compact" nav>
      <RouterLink to="/admin/orders">
        <v-list-item
          prepend-icon="mdi-order-bool-ascending"
          title="Замовлення"
          value="orders"
        ></v-list-item>
      </RouterLink>
      <RouterLink to="/admin/products">
        <v-list-item
          prepend-icon="mdi-folder"
          title="Товари"
          value="products"
        ></v-list-item>
      </RouterLink>
      <RouterLink v-if="store.getRole === 'admin'" to="/admin/articles">
        <v-list-item
          prepend-icon="mdi-post"
          title="Статті"
          value="articles"
        ></v-list-item>
      </RouterLink>
      <RouterLink
        v-if="store.getRole === 'admin'"
        to="/admin/video-photo-gallery"
      >
        <v-list-item
          prepend-icon="mdi-view-gallery"
          title="Відео, фото галерея"
          value="video-photo-gallery"
        ></v-list-item>
      </RouterLink>
      <RouterLink v-if="store.getRole === 'admin'" to="/admin/rubrics">
        <v-list-item
          prepend-icon="mdi-square"
          title="Рубрики"
          value="rubrics"
        ></v-list-item>
      </RouterLink>
      <RouterLink v-if="store.getRole === 'admin'" to="/admin/partners">
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Партнери"
          value="partners"
        ></v-list-item>
      </RouterLink>
      <RouterLink to="/admin/settings">
        <v-list-item
          prepend-icon="mdi-cog"
          title="Загальні налаштування"
          value="settings"
        >
        </v-list-item>
      </RouterLink>
      <v-list-item
        prepend-icon="mdi-exit-to-app"
        title="Вихід"
        value="exit"
        @click="exit"
      >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup>
import useUserStore from "../stores/user.js";

const props = defineProps(["isNavOpen"]);

const store = useUserStore();

function exit() {
  store.setIsAuthenticated(false);
  store.setToken("");

  window.location.href = "/admin/auth";
}
</script>
