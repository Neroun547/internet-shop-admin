<template>
  <v-dialog v-model="isDeleteProductDialogOpen" max-width="600">
    <v-card>
      <v-card-title
        >Ви дійсно хочете видалити {{ activeDeleteProductName }}?</v-card-title
      >
      <v-card-actions class="mt-5">
        <v-btn
          @click="isDeleteProductDialogOpen = false"
          class="bg-yellow-accent-4"
          >Ні</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn @click="deleteProduct" class="bg-red">Так</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div v-if="!products.length">
    <h2 class="text-center no-data-text mt-5">Продуктів поки що немає ...</h2>
  </div>
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
          <v-img :src="API_URL + '/images/' + product.file_name"></v-img>
        </v-card-item>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-subtitle class="text-center">{{
          product.type
        }}</v-card-subtitle>
        <v-card-subtitle class="text-center mt-3"
          >Ціна: {{ product.price }}</v-card-subtitle
        >
        <v-card-subtitle class="text-center mt-3"
          >Порядковий номер: {{ product.num }}</v-card-subtitle
        >
        <v-card-subtitle class="mt-3 text-center">
          <span v-if="product.available" class="text-green">Є в наявності</span>
          <span v-if="!product.available" class="text-red"
            >Немає в наявності</span
          >
        </v-card-subtitle>
        <v-card-actions class="mt-3">
          <v-btn
            class="bg-red"
            @click="openDeleteProductDialog(product.id, product.name)"
            >Видалити</v-btn
          >
          <v-spacer></v-spacer>
          <RouterLink :to="'/admin/products/' + product.id">
            <v-btn class="text-yellow-accent-4">Редагувати</v-btn>
          </RouterLink>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup>
import { API_URL } from "@/constants";

defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["delete-product"]);

const isDeleteProductDialogOpen = ref(false);
const activeDeleteProductId = ref(null);
const activeDeleteProductName = ref("");

function deleteProduct() {
  emit("delete-product", activeDeleteProductId.value);
  isDeleteProductDialogOpen.value = false;
}

function openDeleteProductDialog(productId, productName) {
  activeDeleteProductId.value = productId;
  activeDeleteProductName.value = productName;
  isDeleteProductDialogOpen.value = true;
}
</script>
