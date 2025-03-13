<template>
  <v-card class="pa-5 mb-5 mt-5" v-for="(order, index) in orders" :key="index">
    <v-card-title style="text-wrap: wrap">
      {{order.created_at}}
    </v-card-title>
    <v-card-subtitle v-for="product in order.productsList" v-bind:key="product.id">
      {{product}}
    </v-card-subtitle>
    <v-card-subtitle class="mt-3">
      <span v-if="order.status === null" class="text-red">Не виконано</span>
      <span v-if="order.status === 'completed'" class="text-green">Виконано</span>
      <span v-if="order.status === 'in_process'" class="text-black">В процесі</span>
      <span v-if="order.status === 'returned'" class="text-black">Повернено клієнтом</span>
    </v-card-subtitle>
    <v-card-subtitle v-if="order.sum">Сума замовлення: {{order.sum}}</v-card-subtitle>
    <v-card-actions v-if="!hideDetailsBtn">
      <v-spacer></v-spacer>
      <RouterLink :to="'/admin/orders/' + order.id_order">
        <v-btn>Детальніше</v-btn>
      </RouterLink>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    orders: {
      type: Array,
      required: true
    },
    hideDetailsBtn: {
      type: Boolean,
      required: false
    }
  },
  mounted() {
    console.log(this.orders);
  }
}
</script>
