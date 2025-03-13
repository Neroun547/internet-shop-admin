<template>
  <v-row class="mt-5">
    <v-col
      v-for="product in products"
      :key="product.id"
      cols="12"
      lg="3"
      class="mb-5"
    >
      <v-card>
        <v-card-item>
          <v-img :src="api_url + '/images/' + product.file_name"></v-img>
        </v-card-item>
        <v-card-title>{{product.name}}</v-card-title>
        <v-card-subtitle class="text-center">{{product.type}}</v-card-subtitle>
        <v-card-subtitle class="text-center mt-3">Ціна: {{product.price}}</v-card-subtitle>
        <v-card-subtitle class="mt-3 text-center">
          <span v-if="product.available" class="text-green">Є в наявності</span>
          <span v-if="!product.available" class="text-red">Немає в наявності</span>
        </v-card-subtitle>
        <v-card-actions class="mt-3">
          <v-btn class="bg-red" @click="openDeleteProductDialog(product.id, product.name)">Видалити</v-btn>
          <v-spacer></v-spacer>
          <RouterLink :to="'/admin/products/' + product.id">
            <v-btn class="text-yellow-accent-4">Редагувати</v-btn>
          </RouterLink>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import {API_URL} from "@/constants.js";

export default {
  props: {
    products: {
      type: Array,
      required: true
    }
  },
  computed: {
    api_url: {
      get() {
        return API_URL;
      }
    }
  },
}
</script>
